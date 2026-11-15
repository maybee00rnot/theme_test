// Minimal Burger UI
// Прячет родной топ-бар и лишние кнопки (это делает style.css),
// а здесь создаём бургер + выезжающую панель, которая проксирует клики
// на СПРЯТАННЫЕ родные элементы ST — то есть вся родная логика
// (открытие дровера персонажей, персон, настроек и т.д.) работает как раньше,
// просто вызывается не из топ-бара, а из нашей панели.
//
// ВАЖНО: id элементов ниже взяты из структуры стандартных тем ST.
// Если у тебя другая версия таверны и что-то не откроется —
// открой консоль разработчика (F12), найди нужную кнопку через
// "инспектировать элемент" и пришли мне её настоящий id/класс —
// поправим список ниже.

(function () {
    "use strict";

    // Список пунктов бокового меню.
    // selectors — список кандидатов через запятую, кликаем первый найденный.
    const MENU_SECTIONS = [
        {
            title: "Чат",
            items: [
                { label: "Персонажи", icon: "fa-solid fa-address-card", selectors: "#rightNavDrawerIcon" },
                { label: "Группы", icon: "fa-solid fa-users", selectors: "#rm_button_group_chats, #groupControlsToggle" },
                { label: "Персоны (ваш профиль)", icon: "fa-solid fa-id-badge", selectors: "#persona-management-button" },
            ],
        },
        {
            title: "Настройки",
            items: [
                { label: "Подключение / API", icon: "fa-solid fa-plug", selectors: "#sys-settings-button, #API-status-top" },
                { label: "Пресеты / промпты", icon: "fa-solid fa-sliders", selectors: "#leftNavDrawerIcon" },
                { label: "Форматирование", icon: "fa-solid fa-font", selectors: "#advanced-formatting-button" },
                { label: "Мир / Lorebook", icon: "fa-solid fa-book-atlas", selectors: "#WI-SP-button, #WIDrawerIcon" },
                { label: "Фоны", icon: "fa-solid fa-image", selectors: "#backgrounds-drawer-toggle, #backgrounds-button, #logo_block" },
                { label: "Расширения", icon: "fa-solid fa-cubes", selectors: "#extensions-settings-button" },
                { label: "Пользовательские настройки", icon: "fa-solid fa-gear", selectors: "#user-settings-button" },
            ],
        },
        {
            title: "Ввод сообщения",
            items: [
                { label: "Доп. опции сообщения", icon: "fa-solid fa-ellipsis", selectors: "#options_button" },
                { label: "Меню расширений (быстрое)", icon: "fa-solid fa-bolt", selectors: "#extensionsMenuButton" },
            ],
        },
    ];

    function clickFirst(selectorList) {
        const selectors = selectorList.split(",").map((s) => s.trim());
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                el.click();
                return true;
            }
        }
        console.warn("[Minimal Burger UI] Не найден ни один элемент для:", selectorList);
        return false;
    }

    function buildPanel() {
        const panel = document.createElement("div");
        panel.id = "mbu-panel";

        MENU_SECTIONS.forEach((section) => {
            const title = document.createElement("div");
            title.className = "mbu-section-title";
            title.textContent = section.title;
            panel.appendChild(title);

            section.items.forEach((item) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "mbu-btn";
                btn.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
                btn.addEventListener("click", () => {
                    clickFirst(item.selectors);
                    closePanel();
                });
                panel.appendChild(btn);
            });
        });

        return panel;
    }

    let panelEl, overlayEl, burgerEl;

    function openPanel() {
        panelEl.classList.add("mbu-open");
        overlayEl.classList.add("mbu-open");
    }
    function closePanel() {
        panelEl.classList.remove("mbu-open");
        overlayEl.classList.remove("mbu-open");
    }
    function togglePanel() {
        if (panelEl.classList.contains("mbu-open")) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function init() {
        if (document.getElementById("mbu-burger")) return; // уже вставлено

        burgerEl = document.createElement("div");
        burgerEl.id = "mbu-burger";
        burgerEl.innerHTML = '<i class="fa-solid fa-bars"></i>';
        burgerEl.addEventListener("click", togglePanel);

        overlayEl = document.createElement("div");
        overlayEl.id = "mbu-overlay";
        overlayEl.addEventListener("click", closePanel);

        panelEl = buildPanel();

        document.body.appendChild(overlayEl);
        document.body.appendChild(panelEl);
        document.body.appendChild(burgerEl);
    }

    function waitForBody() {
        if (document.body) {
            init();
        } else {
            requestAnimationFrame(waitForBody);
        }
    }

    waitForBody();

    // =========================================================
    // Авто-тема "Mono B&W (Burger UI)"
    //
    // При ПЕРВОМ запуске расширения добавляем в список тем ST
    // простую чёрно-белую тему БЕЗ собственного custom_css —
    // чтобы она не воевала !important-правилами с нашим style.css
    // и с твоей кастомной темой. Активируем её один раз.
    // Дальше, если ты сама выберешь другую тему вручную,
    // расширение больше не будет её переключать обратно —
    // проверяется через localStorage-флаг ниже.
    // =========================================================

    const MONO_THEME_NAME = "Mono B&W (Burger UI)";
    const MONO_FLAG_KEY = "mbu_mono_theme_applied_v1";

    const MONO_THEME_DATA = {
        blur_strength: 0,
        main_text_color: "rgba(255, 255, 255, 1)",
        italics_text_color: "rgba(190, 190, 190, 1)",
        underline_text_color: "rgba(190, 190, 190, 1)",
        quote_text_color: "rgba(170, 170, 170, 1)",
        blur_tint_color: "rgba(0, 0, 0, 1)",
        chat_tint_color: "rgba(0, 0, 0, 0)",
        user_mes_blur_tint_color: "rgba(20, 20, 20, 1)",
        bot_mes_blur_tint_color: "rgba(10, 10, 10, 1)",
        shadow_color: "rgba(0, 0, 0, 0)",
        shadow_width: 0,
        border_color: "rgba(255, 255, 255, 0.08)",
        font_scale: 1,
        fast_ui_mode: true,
        waifuMode: false,
        avatar_style: 0,
        chat_display: 0,
        toastr_position: "toast-top-center",
        noShadows: true,
        chat_width: 50,
        timer_enabled: false,
        timestamps_enabled: false,
        timestamp_model_icon: false,
        mesIDDisplay_enabled: false,
        hideChatAvatars_enabled: false,
        message_token_count_enabled: false,
        expand_message_actions: false,
        enableZenSliders: false,
        enableLabMode: false,
        hotswap_enabled: true,
        custom_css: "", // пусто намеренно — не конфликтует с нашим CSS
        bogus_folders: false,
        zoomed_avatar_magnification: false,
        reduced_motion: true,
        compact_input_area: true,
        show_swipe_num_all_messages: false,
        click_to_edit: false,
        media_display: "list",
    };

    async function ensureMonoTheme() {
        let scriptModule, powerUserModule;
        try {
            // Пути стандартные для third-party расширений ST.
            // Если у тебя другая структура папок — здесь будет исключение,
            // оно уйдёт в catch и просто пропустит авто-тему (бургер-меню
            // при этом продолжит работать как ни в чём не бывало).
            scriptModule = await import("../../../../script.js");
            powerUserModule = await import("../../../power-user.js");
        } catch (err) {
            console.warn(
                "[Minimal Burger UI] Не удалось подключить модули для авто-темы (бургер-меню это не затрагивает):",
                err
            );
            return;
        }

        const power_user = powerUserModule.power_user;
        const saveSettingsDebounced = scriptModule.saveSettingsDebounced;

        if (!power_user || !Array.isArray(power_user.themes)) {
            console.warn("[Minimal Burger UI] power_user.themes недоступен, пропускаю авто-тему");
            return;
        }

        let theme = power_user.themes.find((t) => t.name === MONO_THEME_NAME);
        if (!theme) {
            theme = { name: MONO_THEME_NAME, ...MONO_THEME_DATA };
            power_user.themes.push(theme);
        }

        // Добавляем опцию в выпадающий список тем, если её там ещё нет
        const select = document.querySelector("#themes");
        if (select && !select.querySelector(`option[value="${CSS.escape(MONO_THEME_NAME)}"]`)) {
            const opt = document.createElement("option");
            opt.value = MONO_THEME_NAME;
            opt.textContent = MONO_THEME_NAME;
            select.appendChild(opt);
        }

        const alreadyOfferedOnce = localStorage.getItem(MONO_FLAG_KEY);
        if (!alreadyOfferedOnce) {
            // Первый запуск расширения — реально переключаем тему
            power_user.theme = MONO_THEME_NAME;
            if (select) {
                select.value = MONO_THEME_NAME;
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }
            if (typeof saveSettingsDebounced === "function") {
                saveSettingsDebounced();
            }
            localStorage.setItem(MONO_FLAG_KEY, "1");
            console.log("[Minimal Burger UI] Активирована тема Mono B&W (один раз, при первом запуске).");
        }
    }

    // Запускаем попытку подключения авто-темы независимо от бургер-меню.
    setTimeout(() => {
        ensureMonoTheme();
    }, 300); // небольшая задержка, чтобы #themes успел отрисоваться
})();
