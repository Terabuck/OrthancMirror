'use strict';  

// Inject translation module
var app = angular.module("app", ["pascalprecht.translate", "ngCookies"]);

app.config(function ($translateProvider) {
  
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: './languages/{lang}/{part}.json'
    });

    $translateProvider.preferredLanguage('es');

    // try to find out preferred language 
    $translateProvider.determinePreferredLanguage();

    $translateProvider.usePostCompiling(true);

    // remember language
    $translateProvider.useLocalStorage();

    // sanitize
    $translateProvider.useSanitizeValueStrategy("escape");
  
  },
);

app.controller("AppController", function ($scope, $translate, $translatePartialLoader) {
  // store options array version (sorted as in https://www.visualcapitalist.com/100-most-spoken-languages/)
  $scope.languages = [
    { langname: "English", lang: "en" },
    { langname: "中文", lang: "zh" },
    { langname: "हिन्दी भाषा", lang: "hi" },
    { langname: "Castellano", lang: "es" },
    { langname: "Français", lang: "fr" },
    { langname: "বাংলা ভাষা", lang: "bn" },
    { langname: "Русский", lang: "ru" },
    { langname: "Português", lang: "pt" },
    { langname: "Bahasa", lang: "id" },
    { langname: "Deutsche", lang: "de" },
    { langname: "日本語", lang: "jp" },
    { langname: "Kiswahili", lang: "sw" },
    { langname: "Italiano", lang: "it" },
    { langname: "Nederlandse", lang: "nl" }
  ];

  // store the current used version
  this.versions = {
    ajs: angular.version.full,
    translate: $translate.versionInfo(),
  };

  this.text = {};
  $scope.text = this.text;
  
  // invoke a language change
  $scope.updateLang = function (langUpdated) {
    langUpdated = $scope.langselected.lang;

    $translate.use(langUpdated)
      .then(function (langUpdated) {
      this.currentLanguage = langUpdated;
      }
      .then(localStorage.clear("NG_TRANSLATE_LANG_KEY")));
      
    $translate.fallbackLanguage(langUpdated);
    window.location.reload();

    $scope.OpenDeleteResourceDialog = function()
    {
      $translate(['Name']).then(function (translations) {
        translations.Name;
    });
      
    }

  };
  $translatePartialLoader.addPart('explorer-html');
  $translatePartialLoader.addPart('explorer-js');
  updateExplorer( $translate);

});
// Refresh view to show translation
function updateExplorer($translate) {
  $translate.refresh().then(
    $(window).on('hashchange', function () {
      window.location.reload(true);
    })

  );
}