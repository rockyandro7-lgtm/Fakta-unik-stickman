import sys, re, subprocess, numpy as np, wave
src, dst, target = sys.argv[1], sys.argv[2], float(sys.argv[3])
SR=44100
raw = subprocess.run(['ffmpeg','-v','quiet','-i',src,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32)/32768
log = subprocess.run(['ffmpeg','-hide_banner','-i',src,'-af','silencedetect=noise=-38dB:d=0.2','-f','null','-'],capture_output=True,text=True).stderr
st=[float(v) for v in re.findall(r'silence_start: ([0-9.]+)',log)]; en=[float(v) for v in re.findall(r'silence_end: ([0-9.]+)',log)]
KEEP=0.13
segs=[]; cur=0
for s,e in zip(st,en):
    if e-s>KEEP:
        mid=(s+e)/2
        segs.append((cur, int((s+0.04)*SR)))       # keep a short tail
        cur = int((e-(KEEP-0.04))*SR)
segs.append((cur,len(x)))
import json
fade=int(0.01*SR)
out=[]
for a,b in segs:
    c=x[a:b].copy(); c[:fade]*=np.linspace(0,1,fade); c[-fade:]*=np.linspace(1,0,fade); out.append(c)
y=np.concatenate(out)
# trim leading/trailing silence
thr=10**(-40/20); idx=np.where(np.abs(y)>thr)[0]; y=y[max(0,idx[0]-int(0.05*SR)):idx[-1]+int(0.15*SR)]
lead=max(0,idx[0]-int(0.05*SR))
dur=len(y)/SR; tempo=max(1.0,dur/target)
mp=[];acc=0
for a,b in segs:
    mp.append([a/SR,b/SR,acc/SR]); acc+=b-a
json.dump({'segs':mp,'lead':lead/SR,'tempo':tempo},open(dst+'.map.json','w'))
print('tightened',round(dur,2),'tempo',round(tempo,3))
wave_path=dst+'.tmp.wav'
w=wave.open(wave_path,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg','-y','-v','quiet','-i',wave_path,'-af',f'atempo={max(1.0,tempo):.4f},loudnorm=I=-15:TP=-1.5:LRA=9','-ar','48000','-ac','1',dst],check=True)
