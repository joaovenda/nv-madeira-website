document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o utilizador já respondeu ao banner (guarda no browser)
    const consent = localStorage.getItem('nv_cookie_consent');
    if (consent) {
        return; // Já respondeu, não mostra a barra
    }

    // Injetar os estilos CSS do banner para manter tudo isolado
    const style = document.createElement('style');
    style.innerHTML = `
        #cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(28, 43, 30, 0.95); /* A cor verde escura do site */
            backdrop-filter: blur(12px);
            border-top: 1px solid rgba(184, 168, 152, 0.2);
            color: #FDFBF7;
            padding: 24px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 16px;
            box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
            font-family: 'Inter', sans-serif;
            transform: translateY(100%);
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #cookie-banner.show {
            transform: translateY(0);
        }
        .cookie-content {
            flex: 1;
            font-size: 0.875rem;
            line-height: 1.5;
            color: rgba(253, 251, 247, 0.8);
        }
        .cookie-content strong {
            color: #FDFBF7;
            display: block;
            margin-bottom: 6px;
            font-size: 1rem;
        }
        .cookie-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .cookie-btn {
            padding: 10px 20px;
            border-radius: 0px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .cookie-btn-accept {
            background: #C9933A; /* A cor dourada primária do site */
            color: #1C2B1E;
            border: 1px solid #C9933A;
        }
        .cookie-btn-accept:hover {
            background: #dcb065;
            border-color: #dcb065;
        }
        .cookie-btn-reject {
            background: transparent;
            color: #C9933A;
            border: 1px solid #C9933A;
        }
        .cookie-btn-reject:hover {
            background: rgba(201, 147, 58, 0.1);
        }
        @media (min-width: 768px) {
            #cookie-banner {
                flex-direction: row;
                align-items: center;
                padding: 24px 48px;
            }
        }
    `;
    document.head.appendChild(style);

    // Criar a estrutura HTML do banner e injetá-la no Body
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <strong>Privacidade e Cookies</strong>
            Utilizamos cookies estritamente necessários para o funcionamento do site e cookies do Google Analytics para entender como os utilizadores navegam, de forma a podermos melhorar a nossa oferta. Os dados recolhidos são anónimos.
        </div>
        <div class="cookie-buttons">
            <button id="btn-reject-cookies" class="cookie-btn cookie-btn-reject">Apenas Necessários</button>
            <button id="btn-accept-cookies" class="cookie-btn cookie-btn-accept">Aceitar Todos</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Animação de entrada suave após a página carregar
    setTimeout(() => {
        banner.classList.add('show');
    }, 800);

    // Funcionalidade do botão "Aceitar Todos"
    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
        localStorage.setItem('nv_cookie_consent', 'granted');
        
        // Enviar sinal "granted" para o Google Consent Mode v2
        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'analytics_storage': 'granted'
        });

        // Ocultar banner e removê-lo do código
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 600);
    });

    // Funcionalidade do botão "Apenas Necessários"
    document.getElementById('btn-reject-cookies').addEventListener('click', () => {
        localStorage.setItem('nv_cookie_consent', 'denied');
        
        // Ocultar banner
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 600);
    });
});
