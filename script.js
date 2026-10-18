// ==========================================
// 1. MENYU — açıb-bağlamaq
// ==========================================
function menyunuAcBagla() {
    let menyu = document.getElementById("menyuPaneli");
    menyu.classList.toggle("aktiv");
}


// ==========================================
// 2. SƏBƏT
// Səbət bir massivdir (array). Hər element bir obyektdir:
// { ad: "Bitki Qabı", qiymet: 30, sekil: "dibcek.png", say: 2 }
// ==========================================
let sebet = [];

// Məhsulu səbətə əlavə edir
function sebetaAt(ad, qiymet, sekil) {
    // Əvvəlcə yoxlayırıq: bu məhsul artıq səbətdə varmı?
    let tapildi = false;

    for (let i = 0; i < sebet.length; i++) {
        if (sebet[i].ad === ad) {
            sebet[i].say = sebet[i].say + 1;   // varsa, sayını artırırıq
            tapildi = true;
        }
    }

    // Yoxdursa, yeni obyekt kimi əlavə edirik
    if (tapildi === false) {
        sebet.push({ ad: ad, qiymet: qiymet, sekil: sekil, say: 1 });
    }

    sebetiYenile();
    bildirisGoster("✅ " + ad + " səbətə əlavə olundu");

    // Səbət qutusunu "titrədirik"
    let qutu = document.getElementById("sebetQutusu");
    qutu.classList.add("titre");
    setTimeout(function () {
        qutu.classList.remove("titre");
    }, 500);
}

// Səbəti ekranda yenidən çəkir (siyahı, sayı, cəm qiymət)
function sebetiYenile() {
    let siyahi = document.getElementById("sebetSiyahisi");
    siyahi.innerHTML = "";   // köhnə siyahını silirik

    let umumiSay = 0;
    let cem = 0;

    if (sebet.length === 0) {
        siyahi.innerHTML = '<li class="bos-sebet">Səbətiniz boşdur 🛍️</li>';
    }

    for (let i = 0; i < sebet.length; i++) {
        let mehsul = sebet[i];
        umumiSay = umumiSay + mehsul.say;
        cem = cem + mehsul.qiymet * mehsul.say;

        siyahi.innerHTML +=
            '<li class="sebet-mehsulu">' +
                '<img src="' + mehsul.sekil + '" alt="' + mehsul.ad + '">' +
                '<div class="sebet-melumat">' +
                    '<h4>' + mehsul.ad + '</h4>' +
                    '<span>' + (mehsul.qiymet * mehsul.say) + ' AZN</span>' +
                '</div>' +
                '<div class="say-idaresi">' +
                    '<button onclick="sayiDeyis(' + i + ', -1)">−</button>' +
                    '<b>' + mehsul.say + '</b>' +
                    '<button onclick="sayiDeyis(' + i + ', 1)">+</button>' +
                '</div>' +
                '<button class="sil-duymesi" onclick="mehsuluSil(' + i + ')">🗑️</button>' +
            '</li>';
    }

    document.getElementById("sebet-sayi").innerText = umumiSay;
    document.getElementById("cemQiymet").innerText = cem + " AZN";

    // Səbəti brauzerin yaddaşında saxlayırıq (səhifə yenilənəndə itməsin)
    localStorage.setItem("sebet", JSON.stringify(sebet));
}

// Məhsulun sayını 1 artırır və ya 1 azaldır
function sayiDeyis(index, deyisme) {
    sebet[index].say = sebet[index].say + deyisme;

    if (sebet[index].say <= 0) {
        mehsuluSil(index);
    } else {
        sebetiYenile();
    }
}

// Məhsulu səbətdən tamamilə silir
function mehsuluSil(index) {
    sebet.splice(index, 1);   // index-dən başlayaraq 1 element sil
    sebetiYenile();
}

// Bütün səbəti boşaldır
function sebetiTemizle() {
    if (sebet.length === 0) {
        return;
    }
    if (confirm("Səbəti təmizləmək istədiyinizə əminsiniz?")) {
        sebet = [];
        sebetiYenile();
        bildirisGoster("🗑️ Səbət təmizləndi");
    }
}

// Səbət panelini açır / bağlayır
function sebetiAcBagla() {
    document.getElementById("sebetPaneli").classList.toggle("acik");
    document.getElementById("qaraFon").classList.toggle("acik");
}

// Sifariş ver düyməsi
function sifarisVer() {
    if (sebet.length === 0) {
        bildirisGoster("⚠️ Səbətiniz boşdur!");
        return;
    }

    let cem = document.getElementById("cemQiymet").innerText;
    alert("Təşəkkür edirik! Sifarişiniz qəbul olundu.\nÜmumi məbləğ: " + cem);

    sebet = [];
    sebetiYenile();
    sebetiAcBagla();
}


// ==========================================
// 3. BİLDİRİŞ (toast) — aşağıda qısa mesaj göstərir
// ==========================================
let bildirisTaymeri;

function bildirisGoster(metn) {
    let bildiris = document.getElementById("bildiris");
    bildiris.innerText = metn;
    bildiris.classList.add("gorunur");

    // Əvvəlki taymeri dayandırırıq ki, mesajlar qarışmasın
    clearTimeout(bildirisTaymeri);
    bildirisTaymeri = setTimeout(function () {
        bildiris.classList.remove("gorunur");
    }, 2500);
}


// ==========================================
// 4. AXTARIŞ — yazdıqca məhsulları süzür
// ==========================================
function mehsullariAxtar() {
    let axtarilan = document.getElementById("axtarisXanasi").value.toLowerCase();
    let kartlar = document.querySelectorAll(".mehsul-karti");
    let tapilanSay = 0;

    for (let i = 0; i < kartlar.length; i++) {
        let ad = kartlar[i].querySelector("h3").innerText.toLowerCase();

        if (ad.includes(axtarilan)) {
            kartlar[i].style.display = "flex";   // uyğundursa göstər
            tapilanSay++;
        } else {
            kartlar[i].style.display = "none";   // uyğun deyilsə gizlət
        }
    }

    // Heç nə tapılmasa xəbərdarlıq yazısını göstəririk
    let yazi = document.getElementById("tapilmadi");
    if (tapilanSay === 0) {
        yazi.style.display = "block";
    } else {
        yazi.style.display = "none";
    }
}


// ==========================================
// 5. SIRALAMA — qiymətə və ya ada görə
// ==========================================
function mehsullariSirala() {
    let secim = document.getElementById("siralamaSecimi").value;
    let qutu = document.getElementById("mehsullarQutusu");

    // querySelectorAll massiv qaytarmır, Array.from ilə massivə çeviririk
    let kartlar = Array.from(qutu.querySelectorAll(".mehsul-karti"));

    kartlar.sort(function (a, b) {
        if (secim === "ucuz") {
            return a.dataset.qiymet - b.dataset.qiymet;
        } else if (secim === "baha") {
            return b.dataset.qiymet - a.dataset.qiymet;
        } else if (secim === "ad") {
            let adA = a.querySelector("h3").innerText;
            let adB = b.querySelector("h3").innerText;
            return adA.localeCompare(adB, "az");
        } else {
            return a.dataset.sira - b.dataset.sira;   // standart sıra
        }
    });

    // Sıralanmış kartları yenidən qutuya yerləşdiririk
    for (let i = 0; i < kartlar.length; i++) {
        qutu.appendChild(kartlar[i]);
    }
}


// ==========================================
// 6. ŞƏKLİ BÖYÜT (modal pəncərə)
// ==========================================
function sekliBoyut(sekil) {
    // "sekil" — klikləndiyimiz <img> elementidir (HTML-də "this")
    document.getElementById("modalSekil").src = sekil.src;
    document.getElementById("modalYazi").innerText = sekil.alt;
    document.getElementById("sekilModal").classList.add("acik");
}

function modaliBagla() {
    document.getElementById("sekilModal").classList.remove("acik");
}


// ==========================================
// 7. ƏLAQƏ FORMU — yoxlama (validasiya) və e-poçta göndərmə
// ==========================================
const MAIL_UNVANI = "ceferliisrafil1@gmail.com";   // mesajlar bu ünvana gəlir

function formuGonder(event) {
    event.preventDefault();   // səhifənin yenilənməsinin qarşısını alırıq

    let ad = document.getElementById("formAd").value.trim();
    let email = document.getElementById("formEmail").value.trim();
    let mesaj = document.getElementById("formMesaj").value.trim();
    let xeta = document.getElementById("formXeta");

    xeta.classList.remove("ugurlu");

    if (ad === "" || email === "" || mesaj === "") {
        xeta.innerText = "⚠️ Zəhmət olmasa bütün xanaları doldurun.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        xeta.innerText = "⚠️ E-poçt ünvanı düzgün deyil.";
        return;
    }

    if (mesaj.length < 10) {
        xeta.innerText = "⚠️ Mesaj ən azı 10 simvol olmalıdır.";
        return;
    }

    // Hər şey qaydasındadırsa — mesajı e-poçta göndəririk
    let forma = event.target;
    let duyme = document.getElementById("formDuymesi");
    duyme.disabled = true;               // ikinci dəfə basılmasın
    duyme.innerText = "Göndərilir...";
    xeta.innerText = "";

    // FormSubmit xidməti mesajı aşağıdakı ünvana e-poçt kimi çatdırır
    fetch("https://formsubmit.co/ajax/" + MAIL_UNVANI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            Ad: ad,
            email: email,
            Mesaj: mesaj,
            _subject: "Saytdan yeni mesaj: " + ad,
            _template: "table"
        })
    })
        .then(function (cavab) {
            return cavab.json();          // serverin cavabını oxuyuruq
        })
        .then(function (melumat) {
            if (melumat.success === "true" || melumat.success === true) {
                xeta.classList.add("ugurlu");
                xeta.innerText = "✅ Təşəkkürlər, " + ad + "! Mesajınız göndərildi.";
                forma.reset();            // formu təmizləyirik
            } else {
                xeta.innerText = "⚠️ Mesaj göndərilmədi: " + melumat.message;
            }
        })
        .catch(function () {
            xeta.innerText = "⚠️ İnternet bağlantısını yoxlayın və yenidən cəhd edin.";
        })
        .finally(function () {
            duyme.disabled = false;       // nə olursa olsun, düyməni geri açırıq
            duyme.innerText = "Mesajı Göndər";
        });
}


// ==========================================
// 8. YAZI EFFEKTİ — sözlər hərf-hərf yazılır və silinir
// ==========================================
let sozler = ["Qələm qabları", "Kitab stendləri", "Bitki qabları", "Fərdi 3D dizaynlar"];
let sozIndex = 0;     // hansı sözdəyik
let herfIndex = 0;    // sözün neçənci hərfindəyik
let silinir = false;  // indi yazırıq, yoxsa silirik?

function yaziEffekti() {
    let soz = sozler[sozIndex];
    let sahe = document.getElementById("yaziSahesi");

    if (silinir === false) {
        herfIndex++;
    } else {
        herfIndex--;
    }

    sahe.innerText = soz.substring(0, herfIndex);

    let gozleme = 100;   // hər hərf arası 100 millisaniyə

    if (silinir === false && herfIndex === soz.length) {
        silinir = true;
        gozleme = 1500;   // söz tam yazılanda bir az gözləyirik
    } else if (silinir === true && herfIndex === 0) {
        silinir = false;
        sozIndex = (sozIndex + 1) % sozler.length;   // növbəti söz (sonda başa qayıdır)
        gozleme = 400;
    }

    setTimeout(yaziEffekti, gozleme);
}


// ==========================================
// 9. SÜRÜŞDÜRMƏ (scroll) hadisələri
// ==========================================
function elementleriGoster() {
    let elementler = document.querySelectorAll(".gorunme");

    for (let i = 0; i < elementler.length; i++) {
        // Elementin ekranın yuxarısından məsafəsi
        let yuxariMesafe = elementler[i].getBoundingClientRect().top;

        if (yuxariMesafe < window.innerHeight - 80) {
            elementler[i].classList.add("goruldu");
        }
    }
}

window.addEventListener("scroll", function () {
    // "Yuxarı qalx" düyməsi 400px-dən sonra görünür
    let duyme = document.getElementById("yuxariDuymesi");
    if (window.scrollY > 400) {
        duyme.classList.add("gorunur");
    } else {
        duyme.classList.remove("gorunur");
    }

    // Header aşağı düşəndə kiçilir
    let header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("kicik");
    } else {
        header.classList.remove("kicik");
    }

    elementleriGoster();
});

function yuxariQalx() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ==========================================
// 10. KLAVİATURA — Escape düyməsi açıq pəncərələri bağlayır
// ==========================================
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        modaliBagla();
        document.getElementById("sebetPaneli").classList.remove("acik");
        document.getElementById("qaraFon").classList.remove("acik");
        document.getElementById("menyuPaneli").classList.remove("aktiv");
    }
});


// ==========================================
// 11. SƏHİFƏ AÇILANDA işə düşən kod
// ==========================================
// Yadda saxlanmış səbəti geri yükləyirik
let saxlanmisSebet = localStorage.getItem("sebet");
if (saxlanmisSebet !== null) {
    sebet = JSON.parse(saxlanmisSebet);
}
sebetiYenile();

// Footer-də cari ili avtomatik yazırıq
document.getElementById("il").innerText = new Date().getFullYear();

yaziEffekti();
elementleriGoster();
