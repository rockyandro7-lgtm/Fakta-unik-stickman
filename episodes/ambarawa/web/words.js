// Timing PERKIRAAN untuk preview (belum ada suara). Ganti dengan hasil Scribe saat produksi.
const WORDS = [['Umur',.05,.3],['29',.3,.62],['tahun,',.62,.95],['dia',1.0,1.12],['ngusir',1.12,1.45],['tentara',1.45,1.8],['yang',1.8,1.92],['baru',1.92,2.1],['menang',2.1,2.4],['Perang',2.4,2.62],['Dunia',2.62,2.85],['II.',2.85,2.98]].map(([w,s,e])=>({w,s,e,line:0}));
