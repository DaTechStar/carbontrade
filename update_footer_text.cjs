const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  "en": { allRightsReserved: "All rights reserved.", highlyRegulated: "Highly Regulated & Secure" },
  "es": { allRightsReserved: "Todos los derechos reservados.", highlyRegulated: "Altamente Regulado y Seguro" },
  "fr": { allRightsReserved: "Tous droits réservés.", highlyRegulated: "Hautement Réglementé et Sécurisé" },
  "de": { allRightsReserved: "Alle Rechte vorbehalten.", highlyRegulated: "Stark Reguliert & Sicher" },
  "pt": { allRightsReserved: "Todos os direitos reservados.", highlyRegulated: "Altamente Regulamentado e Seguro" },
  "zh-CN": { allRightsReserved: "版权所有。", highlyRegulated: "高度监管与安全" },
  "ko": { allRightsReserved: "모든 권리 보유.", highlyRegulated: "고도의 규제 및 안전" },
  "ja": { allRightsReserved: "無断転載を禁じます。", highlyRegulated: "高度に規制され安全" },
  "ru": { allRightsReserved: "Все права защищены.", highlyRegulated: "Строго Регулируется и Безопасно" },
  "hi": { allRightsReserved: "सर्वाधिकार सुरक्षित।", highlyRegulated: "अत्यधिक विनियमित और सुरक्षित" },
  "tr": { allRightsReserved: "Tüm hakları saklıdır.", highlyRegulated: "Sıkı Düzenlemeye Tabi ve Güvenli" },
  "it": { allRightsReserved: "Tutti i diritti riservati.", highlyRegulated: "Altamente Regolamentato e Sicuro" },
  "ar": { allRightsReserved: "كل الحقوق محفوظة.", highlyRegulated: "منظم للغاية وآمن" }
};

files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Fallback to en if language not found
    const translatedText = translations[lang] || translations['en'];
    
    // Add it to auth root
    if (data.auth) {
      data.auth.allRightsReserved = translatedText.allRightsReserved;
      data.auth.highlyRegulated = translatedText.highlyRegulated;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
