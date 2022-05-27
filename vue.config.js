module.exports = {
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        "/",
        "/Gallery/",
        "/Upload/",
        "/Formats/",
        "/Grants/",
        "/CSS-Playground/",
        //        '/Games/Aethelreds-Academy/',
        //        '/Games/Around-The-Realm/',
        //        '/Games/Clash-At-Ikara/',
        //        '/Games/Post-Work-Paradise/',
        //        '/Games/Raised-By-Mechs/',
        //        '/Games/Umberdred-Institute/',
        "/Shuffled/1N5eeyKTVWo5QeGcUV_zYtwtR0DikJCcvcj6w69UkC1w/",
        "/Shuffled/1N2N8URSswhmxLalPOkzi5d4kdeFiGrsobEmM_ojk0ow/",
        "/Timed/1yq2AKwaYL1uZrCnEfwgSpC0SPkQAZqnCdjNxH_pm018/",
        "/Monster/1NgNHy7Qe1R8KhGR2cOmJwL2aOl2tocBemW2HIAKjrvI/",
        "/SlotMachine/1t5LRUQG9DzMJ3kd8E9DZV7_EbE8J5-Gqhz7TWQ4Y-uU/",
        "/Phases/1HataDfV2lrA4hfzmLgDjXH09dEMLQV6OT10tVH9G52A/",
        "/SecretCards/1JwMF02DSxNKtjHp6u-wyznSs-iEG_3DpOobgc17I16o/",
        "/Shuffled/1rJ3L8E_sBEqiRO8ADQeSAS2UmcK9Xzk0g_F0d_XkkRc/", // Reunion
        "/Shuffled/1WLy_IM9DehQbrBNjTdL67Bc-ZiW83INcfxlnzpDMqnA/", // This Heart Within Me Burns
        "/Shuffled/12dLB630MtjpJGDwEEwD0lvOzMUoACfzgqHQLgTLYTGc/", // Compersion
        "/Shuffled/1p3DrsORsL69s3Iqr8SlpS_G1jy--sAWDPbBBSy6pnZk/", // Generational
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      // maxConcurrentRoutes: 1,
    },
  },
};
