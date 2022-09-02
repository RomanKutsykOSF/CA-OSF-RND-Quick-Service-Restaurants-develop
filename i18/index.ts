import i18n from "i18next";
import resources from "i18/resources";

async function i18nInit(locale: string): Promise<any> {
    await i18n.init({
        resources,
        lng: locale,

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

    return i18n;
}

export default i18nInit;
