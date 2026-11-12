import subprocess, os
B = '/home/user/reels/full-tanpa-tidur/'
ch = [('c0_intro', 'Pembuka'), ('c1_tidur_sains', 'Tidur: apa yang terjadi di otak'), ('c2_tidur_randy', 'Kisah Randy Gardner, 11 hari tanpa tidur'), ('c3_air', 'Air: berapa lama bisa bertahan?'), ('c4_makan', 'Makanan: dari glikogen sampai keton'), ('c5_penutup', 'Kesimpulan')]
t = 0.0; lines = []
for c, name in ch:
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', B + c + '/' + c + '.mp4'], capture_output=True, text=True).stdout.strip())
    lines.append(f'{int(t // 60)}:{int(t % 60):02d} {name}'); t += d
desc = f'''Apa yang terjadi pada tubuhmu kalau tidak tidur, tidak minum, atau tidak makan? Dari 17 jam terjaga sampai rekor 11 hari Randy Gardner, dari batas tanpa air sampai bahaya makan kembali setelah kelaparan.

Video ini hanya untuk edukasi. Jangan mencoba tidak tidur, tidak minum, atau tidak makan. Bukan pengganti saran dokter.

Bab:
''' + '\n'.join(lines) + '''

Sumber:
- Williamson & Feyer (2000), Occupational and Environmental Medicine 57:649-655 (17-19 jam terjaga vs alkohol 0,05% dan 0,1%)
- Xie dkk. (2013), Science 342:373-377 (ruang antarsel otak +60% saat tidur, pada tikus)
- Shokri-Kojori dkk. (2018), PNAS 115:4483-4488 (beta-amiloid naik setelah 1 malam tanpa tidur, 20 orang)
- Waters dkk. (2018), Frontiers in Psychiatry 9:303 (tinjauan 21 studi: 24-48 jam, 48-90 jam, 72 jam)
- NPR (2024), "Lessons from sleeplessness: The 60th anniversary of Randy Gardner's world record"
- Guinness World Records (2023), "What's the limit to how long a human can stay awake?"
- USGS Water Science School, "The Water in You: Water and the Human Body"
- National Academies (2004) Dietary Reference Intakes for Water; ringkasan Mayo Clinic
- Stewart & Fleming (1973), Postgraduate Medical Journal 49:203-209 (puasa terapeutik 382 hari)
- Irish Times, linimasa mogok makan 1981
- Pedoman refeeding syndrome (NICE CG32) dan tinjauan klinis

#fakta #tidur #kesehatan #mitosrumahan #edukasi
'''
title = 'Apa yang Terjadi Kalau Kamu Tidak Tidur 11 Hari? (+ Tanpa Air & Makan)'
open(B + 'YOUTUBE_METADATA.txt', 'w').write('JUDUL:\n' + title + '\n\nDESKRIPSI:\n' + desc + '\nTAG:\nfakta unik, tidak tidur, randy gardner, kurang tidur, dehidrasi, puasa, tubuh manusia, mitos rumahan, edukasi kesehatan\n')
print('total', round(t, 1), 's'); print('\n'.join(lines))
