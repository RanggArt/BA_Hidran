// 1. DATA BINDING TEKS BIASA
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
bindData('in-pem1-nama', 'out-pem1-nama');
bindData('in-pem1-jab', 'out-pem1-jab');
bindData('in-pem2-nama', 'out-pem2-nama');
bindData('in-pem2-jab', 'out-pem2-jab');
bindData('in-rek-hydrant', 'out-rek-hydrant');
bindData('in-kode-hydrant', 'out-kode-hydrant');
bindData('in-catatan', 'out-catatan');

// 2. LOGIC KALENDER OTOMATIS
const dateInput = document.getElementById('in-tanggal-lengkap');
if (dateInput) {
    dateInput.addEventListener('change', (e) => {
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

// 3. FILTER KECAMATAN & KELURAHAN (JAKARTA UTARA)
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
    
    // Reset Kelurahan
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


// 4. CHECKBOXES LOGIC
const boxEmpty = '<span class="cb-icon">☐</span>';
const boxChecked = '<span class="cb-icon cb-checked">☑</span>';

function updateCheckboxes(rowId, selectedValue, optionsArray) {
    let resultHtml = '';
    optionsArray.forEach((opt) => {
        const isChecked = opt === selectedValue;
        const box = isChecked ? boxChecked : boxEmpty;
        resultHtml += `${box} ${opt} &nbsp;&nbsp; `;
    });
    document.getElementById(`out-${rowId}`).innerHTML = resultHtml;
}

// 5. STATUS LOGIC
function updateStatus(val) {
    document.getElementById('stat-layak').innerHTML = (val === 'Layak Operasi' ? boxChecked : boxEmpty) + ' Layak Operasi';
    document.getElementById('stat-catatan').innerHTML = (val === 'Layak Operasi dengan Catatan' ? boxChecked : boxEmpty) + ' Layak Operasi dengan Catatan';
    document.getElementById('stat-tidak').innerHTML = (val === 'Tidak Layak Operasi' ? boxChecked : boxEmpty) + ' Tidak Layak Operasi';
}

// 6. IMAGE UPLOAD LOGIC
document.getElementById('in-foto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const textEl = document.getElementById('out-foto-text');
    const imgEl = document.getElementById('out-foto-img');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imgEl.src = event.target.result;
            imgEl.classList.remove('hidden');
            textEl.classList.add('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        imgEl.classList.add('hidden');
        textEl.classList.remove('hidden');
    }
});

// 7. CANVAS SIGNATURE LOGIC (DIPERBAIKI UNTUK POINTER MELeset)
function setupCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    ctx.strokeStyle = '#2563eb'; 
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    function getCoordinates(event) {
        // Kalkulasi skala perbandingan lebar canvas asli dengan lebar elemen di layar
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = event.clientX;
        let clientY = event.clientY;
        
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const pos = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault(); 
    }

    function draw(e) {
        if (!isDrawing) return;
        const pos = getCoordinates(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.closePath();
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);
}

setupCanvas('sig-pad-1');
setupCanvas('sig-pad-2');

document.querySelectorAll('.btn-clear-sig').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const canvasId = e.target.getAttribute('data-canvas');
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

// 8. EXPORT TO PDF LOGIC (DENGAN NAMA FILE DINAMIS)
document.getElementById('btn-download').addEventListener('click', async () => {
    const btnDownload = document.getElementById('btn-download');
    const originalBtnText = btnDownload.innerHTML;
    
    btnDownload.innerHTML = 'Memproses PDF...';
    btnDownload.disabled = true;

    try {
        // Pindahkan tanda tangan
        const canvas1 = document.getElementById('sig-pad-1');
        const imgSig1 = document.getElementById('img-sig-1');
        imgSig1.src = canvas1.toDataURL("image/png");
        imgSig1.classList.remove('hidden');

        const canvas2 = document.getElementById('sig-pad-2');
        const imgSig2 = document.getElementById('img-sig-2');
        imgSig2.src = canvas2.toDataURL("image/png");
        imgSig2.classList.remove('hidden');

        // Buat Nama File Dinamis (BA_PH_DD_MM_YYYY_NamaKelurahan.pdf)
        let dateStr = "Tgl-Belum-Diisi";
        const dateInput = document.getElementById('in-tanggal-lengkap').value;
        if(dateInput) {
            const d = new Date(dateInput);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            dateStr = `${day}_${month}_${year}`;
        }
        const kelurahanStr = document.getElementById('in-kelurahan').value || "Kel-Belum-Diisi";
        
        // Membersihkan spasi pada nama kelurahan jika ada, ganti dgn underscore (opsional agar nama file rapi)
        const safeKelurahan = kelurahanStr.replace(/\s+/g, '_');
        const pdfFileName = `BA_PH_${dateStr}_${safeKelurahan}.pdf`;

        // Render PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const page1 = document.getElementById('page-1');
        const canvasPage1 = await html2canvas(page1, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        const imgData1 = canvasPage1.toDataURL('image/png');
        pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, pdfHeight);

        pdf.addPage();
        
        const page2 = document.getElementById('page-2');
        const canvasPage2 = await html2canvas(page2, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        const imgData2 = canvasPage2.toDataURL('image/png');
        pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Download dengan nama file khusus
        pdf.save(pdfFileName);

    } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Terjadi kesalahan saat memproses PDF. Pastikan gambar diload lewat server lokal untuk menghindari isu CORS/Tainted Canvas.");
    } finally {
        btnDownload.innerHTML = originalBtnText;
        btnDownload.disabled = false;
        
        document.getElementById('img-sig-1').classList.add('hidden');
        document.getElementById('img-sig-2').classList.add('hidden');
    }
});