const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  "en": "Join Interactive {{name}} today and start earning with expert traders in Stocks, ETFs, Options, Fixed Income & Futures",
  "es": "Únete a Interactive {{name}} hoy y comienza a ganar con operadores expertos en Acciones, ETFs, Opciones, Renta Fija y Futuros",
  "fr": "Rejoignez Interactive {{name}} aujourd'hui et commencez à gagner avec des traders experts en actions, ETF, options, revenus fixes et contrats à terme",
  "de": "Treten Sie Interactive {{name}} noch heute bei und beginnen Sie mit Experten-Tradern in Aktien, ETFs, Optionen, festverzinslichen Wertpapieren und Futures zu verdienen",
  "pt": "Junte-se à Interactive {{name}} hoje e comece a ganhar com traders especialistas em Ações, ETFs, Opções, Renda Fixa e Futuros",
  "zh-CN": "立即加入交互式 {{name}}，与股票、ETF、期权、固定收益和期货领域的专家交易员一起开始赚钱",
  "ko": "지금 대화형 {{name}}에 가입하고 주식, ETF, 옵션, 채권 및 선물 분야의 전문 트레이더와 함께 수익 창출을 시작하세요",
  "ja": "今すぐインタラクティブな {{name}} に参加して、株式、ETF、オプション、債券、先物の専門トレーダーと一緒に稼ぎ始めましょう",
  "ru": "Присоединяйтесь к Interactive {{name}} сегодня и начните зарабатывать с опытными трейдерами на акциях, ETF, опционах, ценных бумагах с фиксированным доходом и фьючерсах",
  "hi": "आज ही इंटरैक्टिव {{name}} से जुड़ें और स्टॉक, ETF, विकल्प, फिक्स्ड इनकम और फ्यूचर्स में विशेषज्ञ व्यापारियों के साथ कमाई शुरू करें",
  "tr": "Bugün İnteraktif {{name}}'e katılın ve Hisse Senetleri, ETF'ler, Opsiyonlar, Sabit Getirili Menkul Kıymetler ve Vadeli İşlemlerde uzman yatırımcılarla kazanmaya başlayın",
  "it": "Unisciti a Interactive {{name}} oggi e inizia a guadagnare con trader esperti in Azioni, ETF, Opzioni, Reddito Fisso e Futures",
  "ar": "انضم إلى {{name}} التفاعلي اليوم وابدأ في الكسب مع المتداولين الخبراء في الأسهم وصناديق الاستثمار المتداولة والخيارات والدخل الثابت والعقود الآجلة"
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
      data.auth.heroText = translatedText;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});
