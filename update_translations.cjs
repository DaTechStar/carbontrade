const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  "en": {
    "auth": {
      "register": {
        "title": "Create an Account",
        "subtitle": "Join the next generation of eco-conscious trading.",
        "username": "Username",
        "email": "Email Address",
        "country": "Country of Residence",
        "countryPlaceholder": "Select a country...",
        "searchCountry": "Search country...",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "acceptTerms": "I agree to the Terms of Service and Privacy Policy.",
        "submit": "Create Account",
        "submitting": "Creating account...",
        "alreadyHaveAccount": "Already have an account?",
        "loginLink": "Log in"
      },
      "login": {
        "title": "Welcome Back",
        "subtitle": "Sign in to access your trading dashboard.",
        "identifier": "Email or Username",
        "password": "Password",
        "rememberMe": "Remember me for 30 days",
        "forgotPassword": "Forgot password?",
        "submit": "Sign In",
        "submitting": "Signing in...",
        "noAccount": "Don't have an account?",
        "registerLink": "Sign up"
      }
    }
  },
  "es": {
    "auth": {
      "register": {
        "title": "Crear una Cuenta",
        "subtitle": "Únase a la próxima generación de comercio ecológico.",
        "username": "Nombre de usuario",
        "email": "Correo electrónico",
        "country": "País de residencia",
        "countryPlaceholder": "Seleccione un país...",
        "searchCountry": "Buscar país...",
        "password": "Contraseña",
        "confirmPassword": "Confirmar contraseña",
        "acceptTerms": "Acepto los Términos de Servicio y la Política de Privacidad.",
        "submit": "Crear Cuenta",
        "submitting": "Creando cuenta...",
        "alreadyHaveAccount": "¿Ya tiene una cuenta?",
        "loginLink": "Iniciar sesión"
      },
      "login": {
        "title": "Bienvenido de nuevo",
        "subtitle": "Inicie sesión para acceder a su panel de operaciones.",
        "identifier": "Correo o nombre de usuario",
        "password": "Contraseña",
        "rememberMe": "Recordarme por 30 días",
        "forgotPassword": "¿Olvidó su contraseña?",
        "submit": "Iniciar Sesión",
        "submitting": "Iniciando sesión...",
        "noAccount": "¿No tiene una cuenta?",
        "registerLink": "Regístrese"
      }
    }
  },
  "fr": {
    "auth": {
      "register": {
        "title": "Créer un Compte",
        "subtitle": "Rejoignez la prochaine génération de trading éco-responsable.",
        "username": "Nom d'utilisateur",
        "email": "Adresse e-mail",
        "country": "Pays de résidence",
        "countryPlaceholder": "Sélectionnez un pays...",
        "searchCountry": "Rechercher un pays...",
        "password": "Mot de passe",
        "confirmPassword": "Confirmer le mot de passe",
        "acceptTerms": "J'accepte les conditions d'utilisation et la politique de confidentialité.",
        "submit": "Créer le compte",
        "submitting": "Création en cours...",
        "alreadyHaveAccount": "Vous avez déjà un compte ?",
        "loginLink": "Se connecter"
      },
      "login": {
        "title": "Bon retour",
        "subtitle": "Connectez-vous pour accéder à votre tableau de bord de trading.",
        "identifier": "E-mail ou nom d'utilisateur",
        "password": "Mot de passe",
        "rememberMe": "Se souvenir de moi pendant 30 jours",
        "forgotPassword": "Mot de passe oublié ?",
        "submit": "Se connecter",
        "submitting": "Connexion en cours...",
        "noAccount": "Vous n'avez pas de compte ?",
        "registerLink": "S'inscrire"
      }
    }
  },
  "de": {
    "auth": {
      "register": {
        "title": "Konto erstellen",
        "subtitle": "Treten Sie der nächsten Generation des umweltbewussten Tradings bei.",
        "username": "Benutzername",
        "email": "E-Mail-Adresse",
        "country": "Wohnsitzland",
        "countryPlaceholder": "Land auswählen...",
        "searchCountry": "Land suchen...",
        "password": "Passwort",
        "confirmPassword": "Passwort bestätigen",
        "acceptTerms": "Ich stimme den Nutzungsbedingungen und der Datenschutzrichtlinie zu.",
        "submit": "Konto erstellen",
        "submitting": "Konto wird erstellt...",
        "alreadyHaveAccount": "Haben Sie bereits ein Konto?",
        "loginLink": "Anmelden"
      },
      "login": {
        "title": "Willkommen zurück",
        "subtitle": "Melden Sie sich an, um auf Ihr Trading-Dashboard zuzugreifen.",
        "identifier": "E-Mail oder Benutzername",
        "password": "Passwort",
        "rememberMe": "30 Tage lang angemeldet bleiben",
        "forgotPassword": "Passwort vergessen?",
        "submit": "Anmelden",
        "submitting": "Anmeldung läuft...",
        "noAccount": "Noch kein Konto?",
        "registerLink": "Registrieren"
      }
    }
  },
  "pt": {
    "auth": {
      "register": {
        "title": "Criar uma Conta",
        "subtitle": "Junte-se à próxima geração de negociação ecologicamente consciente.",
        "username": "Nome de usuário",
        "email": "Endereço de e-mail",
        "country": "País de residência",
        "countryPlaceholder": "Selecione um país...",
        "searchCountry": "Pesquisar país...",
        "password": "Senha",
        "confirmPassword": "Confirmar senha",
        "acceptTerms": "Concordo com os Termos de Serviço e a Política de Privacidade.",
        "submit": "Criar Conta",
        "submitting": "Criando conta...",
        "alreadyHaveAccount": "Já tem uma conta?",
        "loginLink": "Entrar"
      },
      "login": {
        "title": "Bem-vindo de volta",
        "subtitle": "Faça login para acessar seu painel de negociação.",
        "identifier": "E-mail ou nome de usuário",
        "password": "Senha",
        "rememberMe": "Lembrar de mim por 30 dias",
        "forgotPassword": "Esqueceu a senha?",
        "submit": "Entrar",
        "submitting": "Entrando...",
        "noAccount": "Não tem uma conta?",
        "registerLink": "Inscrever-se"
      }
    }
  },
  "zh-CN": {
    "auth": {
      "register": {
        "title": "创建账户",
        "subtitle": "加入新一代生态意识交易。",
        "username": "用户名",
        "email": "电子邮件地址",
        "country": "居住国家",
        "countryPlaceholder": "选择一个国家...",
        "searchCountry": "搜索国家...",
        "password": "密码",
        "confirmPassword": "确认密码",
        "acceptTerms": "我同意服务条款和隐私政策。",
        "submit": "创建账户",
        "submitting": "创建账户中...",
        "alreadyHaveAccount": "已有账户？",
        "loginLink": "登录"
      },
      "login": {
        "title": "欢迎回来",
        "subtitle": "登录以访问您的交易仪表板。",
        "identifier": "电子邮件或用户名",
        "password": "密码",
        "rememberMe": "记住我 30 天",
        "forgotPassword": "忘记密码？",
        "submit": "登录",
        "submitting": "登录中...",
        "noAccount": "没有账户？",
        "registerLink": "注册"
      }
    }
  },
  "ko": {
    "auth": {
      "register": {
        "title": "계정 만들기",
        "subtitle": "차세대 친환경 트레이딩에 참여하세요.",
        "username": "사용자 이름",
        "email": "이메일 주소",
        "country": "거주 국가",
        "countryPlaceholder": "국가 선택...",
        "searchCountry": "국가 검색...",
        "password": "비밀번호",
        "confirmPassword": "비밀번호 확인",
        "acceptTerms": "서비스 약관 및 개인정보 보호정책에 동의합니다.",
        "submit": "계정 생성",
        "submitting": "계정 생성 중...",
        "alreadyHaveAccount": "이미 계정이 있으신가요?",
        "loginLink": "로그인"
      },
      "login": {
        "title": "다시 오신 것을 환영합니다",
        "subtitle": "트레이딩 대시보드에 액세스하려면 로그인하세요.",
        "identifier": "이메일 또는 사용자 이름",
        "password": "비밀번호",
        "rememberMe": "30일 동안 로그인 유지",
        "forgotPassword": "비밀번호를 잊으셨나요?",
        "submit": "로그인",
        "submitting": "로그인 중...",
        "noAccount": "계정이 없으신가요?",
        "registerLink": "가입하기"
      }
    }
  },
  "ja": {
    "auth": {
      "register": {
        "title": "アカウント作成",
        "subtitle": "次世代の環境配慮型取引に参加しましょう。",
        "username": "ユーザー名",
        "email": "メールアドレス",
        "country": "居住国",
        "countryPlaceholder": "国を選択...",
        "searchCountry": "国を検索...",
        "password": "パスワード",
        "confirmPassword": "パスワードの確認",
        "acceptTerms": "利用規約とプライバシーポリシーに同意します。",
        "submit": "アカウントを作成",
        "submitting": "アカウントを作成中...",
        "alreadyHaveAccount": "すでにアカウントをお持ちですか？",
        "loginLink": "ログイン"
      },
      "login": {
        "title": "おかえりなさい",
        "subtitle": "取引ダッシュボードにアクセスするにはログインしてください。",
        "identifier": "メールまたはユーザー名",
        "password": "パスワード",
        "rememberMe": "30日間ログインを保持",
        "forgotPassword": "パスワードをお忘れですか？",
        "submit": "ログイン",
        "submitting": "ログイン中...",
        "noAccount": "アカウントをお持ちではありませんか？",
        "registerLink": "登録"
      }
    }
  },
  "ru": {
    "auth": {
      "register": {
        "title": "Создать Аккаунт",
        "subtitle": "Присоединяйтесь к новому поколению эко-трейдинга.",
        "username": "Имя пользователя",
        "email": "Адрес электронной почты",
        "country": "Страна проживания",
        "countryPlaceholder": "Выберите страну...",
        "searchCountry": "Поиск страны...",
        "password": "Пароль",
        "confirmPassword": "Подтвердите пароль",
        "acceptTerms": "Я согласен с Условиями обслуживания и Политикой конфиденциальности.",
        "submit": "Создать Аккаунт",
        "submitting": "Создание аккаунта...",
        "alreadyHaveAccount": "Уже есть аккаунт?",
        "loginLink": "Войти"
      },
      "login": {
        "title": "С возвращением",
        "subtitle": "Войдите, чтобы получить доступ к панели трейдинга.",
        "identifier": "Электронная почта или имя пользователя",
        "password": "Пароль",
        "rememberMe": "Запомнить меня на 30 дней",
        "forgotPassword": "Забыли пароль?",
        "submit": "Войти",
        "submitting": "Вход...",
        "noAccount": "Нет аккаунта?",
        "registerLink": "Зарегистрироваться"
      }
    }
  },
  "hi": {
    "auth": {
      "register": {
        "title": "खाता बनाएँ",
        "subtitle": "इको-ट्रेडिंग की अगली पीढ़ी में शामिल हों।",
        "username": "उपयोगकर्ता नाम",
        "email": "ईमेल पता",
        "country": "निवास का देश",
        "countryPlaceholder": "एक देश चुनें...",
        "searchCountry": "देश खोजें...",
        "password": "पासवर्ड",
        "confirmPassword": "पासवर्ड की पुष्टि करें",
        "acceptTerms": "मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ।",
        "submit": "खाता बनाएँ",
        "submitting": "खाता बनाया जा रहा है...",
        "alreadyHaveAccount": "क्या आपके पास पहले से खाता है?",
        "loginLink": "लॉग इन करें"
      },
      "login": {
        "title": "वापसी पर स्वागत है",
        "subtitle": "अपने ट्रेडिंग डैशबोर्ड तक पहुंचने के लिए लॉग इन करें।",
        "identifier": "ईमेल या उपयोगकर्ता नाम",
        "password": "पासवर्ड",
        "rememberMe": "मुझे 30 दिनों तक याद रखें",
        "forgotPassword": "पासवर्ड भूल गए?",
        "submit": "लॉग इन करें",
        "submitting": "लॉग इन हो रहा है...",
        "noAccount": "क्या आपके पास खाता नहीं है?",
        "registerLink": "साइन अप करें"
      }
    }
  },
  "tr": {
    "auth": {
      "register": {
        "title": "Hesap Oluştur",
        "subtitle": "Çevre dostu ticaretin yeni nesline katılın.",
        "username": "Kullanıcı Adı",
        "email": "E-posta Adresi",
        "country": "İkamet Edilen Ülke",
        "countryPlaceholder": "Bir ülke seçin...",
        "searchCountry": "Ülke ara...",
        "password": "Şifre",
        "confirmPassword": "Şifreyi Onayla",
        "acceptTerms": "Hizmet Şartlarını ve Gizlilik Politikasını kabul ediyorum.",
        "submit": "Hesap Oluştur",
        "submitting": "Hesap oluşturuluyor...",
        "alreadyHaveAccount": "Zaten bir hesabınız var mı?",
        "loginLink": "Giriş yap"
      },
      "login": {
        "title": "Tekrar Hoş Geldiniz",
        "subtitle": "Ticaret panelinize erişmek için giriş yapın.",
        "identifier": "E-posta veya Kullanıcı Adı",
        "password": "Şifre",
        "rememberMe": "Beni 30 gün hatırla",
        "forgotPassword": "Şifrenizi mi unuttunuz?",
        "submit": "Giriş Yap",
        "submitting": "Giriş yapılıyor...",
        "noAccount": "Hesabınız yok mu?",
        "registerLink": "Kayıt ol"
      }
    }
  },
  "it": {
    "auth": {
      "register": {
        "title": "Crea un Account",
        "subtitle": "Unisciti alla nuova generazione di trading ecosostenibile.",
        "username": "Nome utente",
        "email": "Indirizzo Email",
        "country": "Paese di residenza",
        "countryPlaceholder": "Seleziona un paese...",
        "searchCountry": "Cerca paese...",
        "password": "Password",
        "confirmPassword": "Conferma Password",
        "acceptTerms": "Accetto i Termini di Servizio e l'Informativa sulla Privacy.",
        "submit": "Crea Account",
        "submitting": "Creazione account...",
        "alreadyHaveAccount": "Hai già un account?",
        "loginLink": "Accedi"
      },
      "login": {
        "title": "Bentornato",
        "subtitle": "Accedi per visualizzare la tua dashboard di trading.",
        "identifier": "Email o Nome utente",
        "password": "Password",
        "rememberMe": "Ricordami per 30 giorni",
        "forgotPassword": "Password dimenticata?",
        "submit": "Accedi",
        "submitting": "Accesso in corso...",
        "noAccount": "Non hai un account?",
        "registerLink": "Iscriviti"
      }
    }
  },
  "ar": {
    "auth": {
      "register": {
        "title": "إنشاء حساب",
        "subtitle": "انضم إلى الجيل التالي من التداول الواعي بالبيئة.",
        "username": "اسم المستخدم",
        "email": "عنوان البريد الإلكتروني",
        "country": "بلد الإقامة",
        "countryPlaceholder": "اختر دولة...",
        "searchCountry": "البحث عن دولة...",
        "password": "كلمة المرور",
        "confirmPassword": "تأكيد كلمة المرور",
        "acceptTerms": "أوافق على شروط الخدمة وسياسة الخصوصية.",
        "submit": "إنشاء حساب",
        "submitting": "جاري إنشاء الحساب...",
        "alreadyHaveAccount": "هل لديك حساب بالفعل؟",
        "loginLink": "تسجيل الدخول"
      },
      "login": {
        "title": "مرحباً بعودتك",
        "subtitle": "قم بتسجيل الدخول للوصول إلى لوحة التداول الخاصة بك.",
        "identifier": "البريد الإلكتروني أو اسم المستخدم",
        "password": "كلمة المرور",
        "rememberMe": "تذكرني لمدة 30 يومًا",
        "forgotPassword": "هل نسيت كلمة المرور؟",
        "submit": "تسجيل الدخول",
        "submitting": "جاري تسجيل الدخول...",
        "noAccount": "ليس لديك حساب؟",
        "registerLink": "التسجيل"
      }
    }
  }
};

files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge auth
    if (translations[lang]) {
      data.auth = translations[lang].auth;
    } else {
      // fallback to en
      data.auth = translations['en'].auth;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});

