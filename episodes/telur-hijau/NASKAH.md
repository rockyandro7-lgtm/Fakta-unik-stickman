# Naskah: Kuning telur rebus hijau (dirender 26-11-2026)

Bentuk cerita kesembilan: **"alarm palsu + perbaikan yang memperparah"**. Budi kira telurnya busuk dan mau buang 30 butir, Rani menuduh ayamnya sakit, Budi merebus lebih lama "biar aman" dan hijaunya makin tebal. Ibu merebus secukupnya lalu air es. Penjelasan lewat dunia mikro penampang telur.
123 kata, suara final 52,24 dtk (tanpa atempo, jeda dipadatkan), video sekitar 52,8 dtk, 15 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Kuning telurnya hijau, dan Budi langsung mau buang tiga puluh butir.
1. Rani nambahin: "Busuk itu, Bud! Ayamnya sakit kali!"
2. Budi ciumin satu-satu. Nggak ada yang bau.
3. Biar aman, dia rebus telur baru. Setengah jam, biar matang sempurna.
4. Dibelah, hijaunya malah makin tebal.
5. Ibu rebus telur baru secukupnya, terus langsung cemplungin ke air es.
6. Dibelah, kuningnya cerah, nggak ada hijaunya sama sekali.
7. Jadi hijau itu bukan busuk. Itu tanda kelamaan direbus.
8. Kalau kepanasan kelamaan, belerang di putih telur lepas jadi gas dan kabur ke tengah.
9. Di situ dia ketemu zat besi dari kuning telur, terus nempel jadi lapisan hijau.
10. Makin lama direbus, makin tebal hijaunya. Air es yang menghentikannya.
11. Tetap aman dimakan, cuma kelihatan seram.
12. Budi manggut-manggut. Besoknya dia rebus lagi setengah jam, dan
    (loop ke kalimat 0)

## Aset baru (`web/env_hijau.js`)
`drawTelurBelah` (telur rebus dibelah: cincin hijau `green`, kuning pucat `over`, aura seram `spooky`, wajah), `drawKartuWaktu` (kartu jam + teks), dunia mikro `mikroTelurBG` (penampang telur raksasa, panas, cincin, air es) + `drawPartikel` (S belerang / Fe besi, bisa jadi gas dan menyatu hijau) + `labelPanah`.
Dapur = set episode Telur (`env_telur.js`, `kitchen()` dari `episodes/telur/web/shots.js`), tong sampah dari `env_nyamuk.js`.
