const bindData = (inputId, outputId, isDefaultDots = true) => {
    const inputEl = document.getElementById(inputId);
    const outputEl = document.getElementById(outputId);
    if (!inputEl || !outputEl) return;
    
    inputEl.addEventListener('input', (e) => {
        let val = e.target.value;
        let defaultFallback = isDefaultDots ? '...................................' : '.....';
        if(inputId === 'in-no-urut') defaultFallback = '.....';
        if(inputId === 'in-kode-bln') defaultFallback = '......';
        outputEl.innerText = val.trim() === '' ? defaultFallback : val;
    });
};

bindData('in-no-urut', 'out-no-urut', false);
bindData('in-kode-bln', 'out-kode-bln', false);
bindData('in-tahun-dok', 'out-tahun-dok', false);
bindData('in-alamat', 'out-alamat');
bindData('in-pem1-jab', 'out-pem1-jab');
bindData('in-pem2-jab', 'out-pem2-jab');
bindData('in-rek-hydrant', 'out-rek-hydrant');
bindData('in-kode-hydrant', 'out-kode-hydrant');
bindData('in-koordinat', 'out-koordinat'); // Bind koordinat
bindData('in-catatan', 'out-catatan');

document.getElementById('in-pem1-nama').addEventListener('input', (e) => {
    let val = e.target.value.trim() === '' ? '...................................' : e.target.value;
    document.getElementById('out-pem1-nama').innerText = val;
    document.getElementById('out-tt-pem1-nama').innerText = val; 
});

document.getElementById('in-pem2-nama').addEventListener('input', (e) => {
    let val = e.target.value.trim() === '' ? '...................................' : e.target.value;
    document.getElementById('out-pem2-nama').innerText = val;
    document.getElementById('out-tt-pem2-nama').innerText = val; 
});

const dateInput = document.getElementById('in-tanggal-lengkap');
if (dateInput) {
    dateInput.addEventListener('change', function(e) {
        this.blur(); // Auto close kalender
        
        const dateVal = e.target.value;
        if (dateVal) {
            const dateObj = new Date(dateVal);
            const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            
            const hari = namaHari[dateObj.getDay()];
            const tgl = dateObj.getDate();
            const bulan = namaBulan[dateObj.getMonth()];
            const tahun = dateObj.getFullYear();
            const tglBulan = `${tgl} ${bulan}`;

            document.getElementById('out-hari').innerText = hari;
            document.getElementById('out-tgl-bln').innerText = tglBulan;
            document.getElementById('out-tahun-waktu').innerText = tahun;
            document.getElementById('out-tt-tgl-2').innerText = tglBulan;
            document.getElementById('out-tahun-cetak').innerText = tahun;
        } else {
            document.getElementById('out-hari').innerText = '....................';
            document.getElementById('out-tgl-bln').innerText = '....................';
            document.getElementById('out-tahun-waktu').innerText = '....................';
            document.getElementById('out-tt-tgl-2').innerText = '............';
            document.getElementById('out-tahun-cetak').innerText = '2026';
        }
    });
}

// LOGIKA GPS / LOKASI KOORDINAT OTOMATIS
const btnGetLocation = document.getElementById('btn-get-location');
if (btnGetLocation) {
    btnGetLocation.addEventListener('click', () => {
        if (navigator.geolocation) {
            btnGetLocation.innerText = "Mencari Lokasi...";
            
            // Setting agar lebih akurat jika fitur GPS HP diaktifkan
            const geoOptions = { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Format output menjadi link Google Maps
                    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
                    
                    // Masukkan ke kolom input form dan preview cetak PDF
                    document.getElementById('in-koordinat').value = mapsLink;
                    document.getElementById('out-koordinat').innerText = mapsLink;
                    
                    btnGetLocation.innerText = "📍 Berhasil!";
                    setTimeout(() => { btnGetLocation.innerText = "📍 Dapatkan Koordinat"; }, 3000);
                },
                (error) => {
                    console.warn(error);
                    alert("Gagal mendapatkan lokasi. Pastikan GPS menyala dan izinkan browser mengakses lokasi Anda.");
                    btnGetLocation.innerText = "📍 Dapatkan Koordinat";
                },
                geoOptions
            );
        } else {
            alert("Browser HP Anda tidak mendukung fitur Geolocation GPS.");
        }
    });
}

const dataJakartaUtara = {
    "Cilincing": ["Cilincing", "Kalibaru", "Marunda", "Rorotan", "Semper Barat", "Semper Timur", "Sukapura"],
    "Kelapa Gading": ["Kelapa Gading Barat", "Kelapa Gading Timur", "Pegangsaan Dua"],
    "Koja": ["Koja", "Lagoa", "Rawa Badak Selatan", "Rawa Badak Utara", "Tugu Selatan", "Tugu Utara"],
    "Pademangan": ["Ancol", "Pademangan Barat", "Pademangan Timur"],
    "Penjaringan": ["Kamal Muara", "Kapuk Muara", "Pejagalan", "Penjaringan", "Pluit"],
    "Tanjung Priok": ["Kebon Bawang", "Papanggo", "Sungai Bambu", "Sunter Agung", "Sunter Jaya", "Tanjung Priok", "Warakas"]
};

const selKecamatan = document.getElementById('in-kecamatan');
const selKelurahan = document.getElementById('in-kelurahan');
const outKecamatan = document.getElementById('out-kecamatan');
const outKelurahan = document.getElementById('out-kelurahan');

selKecamatan.addEventListener('change', function() {
    const kec = this.value;
    outKecamatan.innerText = kec ? kec : '...................................';
    
    selKelurahan.innerHTML = '<option value="">Pilih Kelurahan...</option>';
    outKelurahan.innerText = '...................................';
    
    if (kec) {
        selKelurahan.disabled = false;
        dataJakartaUtara[kec].forEach(kel => {
            const opt = document.createElement('option');
            opt.value = kel;
            opt.innerText = kel;
            selKelurahan.appendChild(opt);
        });
    } else {
        selKelurahan.disabled = true;
    }
});

selKelurahan.addEventListener('change', function() {
    outKelurahan.innerText = this.value ? this.value : '...................................';
});

const boxEmpty = '<span class="cb-icon">☐</span>';
const boxChecked = '<span class="cb-icon cb-checked">☑</span>';

function updateCheckboxes(rowId, selectedValue, optionsArray) {
    let resultHtml = '';
    optionsArray.forEach((opt) => {
        const isChecked = opt === selectedValue;
        const box = isChecked ? boxChecked : boxEmpty;
        resultHtml += `<span style="display: inline-block; margin-right: 16px;">${box} ${opt}</span>`;
    });
    document.getElementById(`out-${rowId}`).innerHTML = resultHtml;
}

function updateStatus(val) {
    document.getElementById('stat-layak').innerHTML = (val === 'Layak Operasi' ? boxChecked : boxEmpty) + ' Layak Operasi';
    document.getElementById('stat-catatan').innerHTML = (val === 'Layak Operasi dengan Catatan' ? boxChecked : boxEmpty) + ' Layak Operasi dengan Catatan';
    document.getElementById('stat-tidak').innerHTML = (val === 'Tidak Layak Operasi' ? boxChecked : boxEmpty) + ' Tidak Layak Operasi';
}

document.getElementById('in-foto').addEventListener('change', function(e) {
    const files = e.target.files;
    
    document.getElementById('out-foto-img-1').classList.add('hidden');
    document.getElementById('out-foto-text-1').classList.remove('hidden');
    document.getElementById('out-foto-img-2').classList.add('hidden');
    document.getElementById('out-foto-text-2').classList.remove('hidden');

    if (files.length > 2) {
        alert("Peringatan: Maksimal lampiran dokumentasi adalah 2 foto!");
        e.target.value = ""; 
        return;
    }

    if (files[0]) {
        const reader1 = new FileReader();
        reader1.onload = function(event) {
            const img1 = document.getElementById('out-foto-img-1');
            img1.src = event.target.result;
            img1.classList.remove('hidden');
            document.getElementById('out-foto-text-1').classList.add('hidden');
        }
        reader1.readAsDataURL(files[0]);
    }

    if (files[1]) {
        const reader2 = new FileReader();
        reader2.onload = function(event) {
            const img2 = document.getElementById('out-foto-img-2');
            img2.src = event.target.result;
            img2.classList.remove('hidden');
            document.getElementById('out-foto-text-2').classList.add('hidden');
        }
        reader2.readAsDataURL(files[1]);
    }
});

// LOGIKA BERSIHKAN FORM / RESET TOTAL (Menyertakan field koordinat)
document.getElementById('btn-reset-form').addEventListener('click', () => {
    if(confirm('Hapus seluruh isian dan tanda tangan untuk mulai dari awal?')) {
        document.getElementById('ba-form').reset();
        
        document.getElementById('in-kelurahan').innerHTML = '<option value="">Pilih Kelurahan...</option>';
        document.getElementById('in-kelurahan').disabled = true;

        const dotFields = [
            'out-hari', 'out-tgl-bln', 'out-tahun-waktu', 
            'out-alamat', 'out-kelurahan', 'out-kecamatan',
            'out-pem1-nama', 'out-pem1-jab', 'out-pem2-nama', 'out-pem2-jab',
            'out-rek-hydrant', 'out-kode-hydrant', 'out-koordinat', 'out-catatan',
            'out-tt-pem1-nama', 'out-tt-pem2-nama'
        ];
        dotFields.forEach(id => document.getElementById(id).innerText = '...................................');
        
        document.getElementById('out-no-urut').innerText = '.....';
        document.getElementById('out-kode-bln').innerText = '......';
        document.getElementById('out-tahun-dok').innerText = '2026';
        document.getElementById('out-tt-tgl-2').innerText = '............';
        document.getElementById('out-tahun-cetak').innerText = '2026';

        ['out-hasil-1', 'out-hasil-2', 'out-hasil-3', 'out-hasil-4', 'out-hasil-5', 'out-hasil-6'].forEach(id => {
            document.getElementById(id).innerHTML = '';
        });
        
        document.getElementById('stat-layak').innerHTML = boxEmpty + ' Layak Operasi';
        document.getElementById('stat-catatan').innerHTML = boxEmpty + ' Layak Operasi dengan Catatan';
        document.getElementById('stat-tidak').innerHTML = boxEmpty + ' Tidak Layak Operasi';

        document.getElementById('out-foto-img-1').classList.add('hidden');
        document.getElementById('out-foto-text-1').classList.remove('hidden');
        document.getElementById('out-foto-img-2').classList.add('hidden');
        document.getElementById('out-foto-text-2').classList.remove('hidden');

        const canvas1 = document.getElementById('sig-pad-1');
        const canvas2 = document.getElementById('sig-pad-2');
        canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height);
        canvas2.getContext('2d').clearRect(0, 0, canvas2.width, canvas2.height);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
