#!/bin/bash
# SessionStart hook (Fakta-unik-stickman)
# 1) Pasang modul Python untuk mesin video bila belum ada.
# 2) Cek GitHub: apakah ada branch berisi hasil kerja yang belum masuk `main`.
#    Hasilnya dicetak ke stdout dan dibaca Claude di awal sesi (lihat CLAUDE.md, "Sinkron repo").
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# ---------- 1. Modul Python (numpy, scipy, soundfile) ----------
if ! python3 -I -c "import numpy, scipy, soundfile" >/dev/null 2>&1; then
  python3 -m pip install -q numpy scipy soundfile >/dev/null 2>&1 \
    || echo "[session-start] Peringatan: gagal memasang numpy/scipy/soundfile."
fi

# ---------- 2. Sinkron repo ----------
fetched=0
for delay in 0 2 4; do
  sleep "$delay"
  if timeout 60 git fetch --prune --quiet origin 2>/dev/null; then fetched=1; break; fi
done
if [ "$fetched" != 1 ]; then
  echo "[sinkron repo] Gagal git fetch. Jalankan 'git fetch --prune origin' manual sebelum mulai kerja."
  exit 0
fi

base=origin/main
cur=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")
pending=""
while read -r ref; do
  [ -z "$ref" ] && continue
  [ "$ref" = "$base" ] && continue
  [ "$ref" = "origin/HEAD" ] && continue
  n=$(git rev-list --count "$base..$ref" 2>/dev/null || echo 0)
  if [ "$n" -gt 0 ]; then
    last=$(git log -1 --format='%ad | %s' --date=format:'%Y-%m-%d %H:%M' "$ref")
    pending+="  - ${ref#origin/}: $n commit belum di main (terakhir: $last)"$'\n'
  fi
done < <(git for-each-ref --format='%(refname:short)' refs/remotes/origin/)

behind=$(git rev-list --count "HEAD..$base" 2>/dev/null || echo 0)

echo "[sinkron repo] Branch sesi ini: $cur"
if [ -n "$pending" ]; then
  echo "[sinkron repo] ADA hasil kerja sesi lain yang BELUM masuk main:"
  printf '%s' "$pending"
  echo "[sinkron repo] Ikuti CLAUDE.md bagian 'Sinkron repo': gabungkan ke main dulu sebelum mengerjakan apa pun."
else
  echo "[sinkron repo] Semua branch sudah masuk main."
fi
if [ "$behind" -gt 0 ]; then
  echo "[sinkron repo] Branch sesi ini tertinggal $behind commit dari main: jalankan 'git merge --ff-only origin/main'."
fi
exit 0
