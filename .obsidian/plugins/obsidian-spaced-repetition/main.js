'use strict';

var obsidian = require('obsidian');

function forOwn(object, callback) {
    if ((typeof object === 'object') && (typeof callback === 'function')) {
        for (var key in object) {
            if (object.hasOwnProperty(key) === true) {
                if (callback(key, object[key]) === false) {
                    break;
                }
            }
        }
    }
}

var lib = (function () {
    var self = {
        count: 0,
        edges: {},
        nodes: {}
    };

    self.link = function (source, target, weight) {
        if ((isFinite(weight) !== true) || (weight === null)) {
            weight = 1;
        }
        
        weight = parseFloat(weight);

        if (self.nodes.hasOwnProperty(source) !== true) {
            self.count++;
            self.nodes[source] = {
                weight: 0,
                outbound: 0
            };
        }

        self.nodes[source].outbound += weight;

        if (self.nodes.hasOwnProperty(target) !== true) {
            self.count++;
            self.nodes[target] = {
                weight: 0,
                outbound: 0
            };
        }

        if (self.edges.hasOwnProperty(source) !== true) {
            self.edges[source] = {};
        }

        if (self.edges[source].hasOwnProperty(target) !== true) {
            self.edges[source][target] = 0;
        }

        self.edges[source][target] += weight;
    };

    self.rank = function (alpha, epsilon, callback) {
        var delta = 1,
            inverse = 1 / self.count;

        forOwn(self.edges, function (source) {
            if (self.nodes[source].outbound > 0) {
                forOwn(self.edges[source], function (target) {
                    self.edges[source][target] /= self.nodes[source].outbound;
                });
            }
        });

        forOwn(self.nodes, function (key) {
            self.nodes[key].weight = inverse;
        });

        while (delta > epsilon) {
            var leak = 0,
                nodes = {};

            forOwn(self.nodes, function (key, value) {
                nodes[key] = value.weight;

                if (value.outbound === 0) {
                    leak += value.weight;
                }

                self.nodes[key].weight = 0;
            });

            leak *= alpha;

            forOwn(self.nodes, function (source) {
                forOwn(self.edges[source], function (target, weight) {
                    self.nodes[target].weight += alpha * nodes[source] * weight;
                });

                self.nodes[source].weight += (1 - alpha) * inverse + leak * inverse;
            });

            delta = 0;

            forOwn(self.nodes, function (key, value) {
                delta += Math.abs(value.weight - nodes[key]);
            });
        }

        forOwn(self.nodes, function (key) {
            return callback(key, self.nodes[key].weight);
        });
    };

    self.reset = function () {
        self.count = 0;
        self.edges = {};
        self.nodes = {};
    };

    return self;
})();

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Error"] = 2] = "Error";
})(LogLevel || (LogLevel = {}));
const createLogger = (console, logLevel) => {
    let info, warn;
    if (logLevel === LogLevel.Info)
        info = Function.prototype.bind.call(console.info, console, "SR:");
    else
        info = (..._) => { };
    if (logLevel <= LogLevel.Warn)
        warn = Function.prototype.bind.call(console.warn, console, "SR:");
    else
        warn = (..._) => { };
    let error = Function.prototype.bind.call(console.error, console, "SR:");
    return { info, warn, error };
};

// العربية
var ar = {};

// čeština
var cz = {};

// Dansk
var da = {};

// Deutsch
var de = {};

// English
var en = {
    // flashcard-modal.ts
    Decks: "Decks",
    "Open file": "Open file",
    "Due cards": "Due cards",
    "New cards": "New cards",
    "Total cards": "Total cards",
    "Reset card's progress": "Reset card's progress",
    Hard: "Hard",
    Good: "Good",
    Easy: "Easy",
    "Show Answer": "Show Answer",
    "Card's progress has been reset.": "Card's progress has been reset.",
    // main.ts
    "Open a note for review": "Open a note for review",
    "Review flashcards": "Review flashcards",
    "Review: Easy": "Review: Easy",
    "Review: Good": "Review: Good",
    "Review: Hard": "Review: Hard",
    "Review note as easy": "Review note as easy",
    "Review note as good": "Review note as good",
    "Review note as hard": "Review note as hard",
    "View statistics": "View statistics",
    note: "note",
    notes: "notes",
    card: "card",
    cards: "cards",
    "Please tag the note appropriately for reviewing (in settings).": "Please tag the note appropriately for reviewing (in settings).",
    "You're all caught up now :D.": "You're all caught up now :D.",
    "Response received.": "Response received.",
    // scheduling.ts
    day: "day",
    days: "days",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
    // settings.ts
    Notes: "Notes",
    Flashcards: "Flashcards",
    "Spaced Repetition Plugin - Settings": "Spaced Repetition Plugin - Settings",
    "For more information, check the": "For more information, check the",
    wiki: "wiki",
    "algorithm implementation": "algorithm implementation",
    "Flashcard tags": "Flashcard tags",
    "Enter tags separated by spaces or newlines i.e. #flashcards #deck2 #deck3.": "Enter tags separated by spaces or newlines i.e. #flashcards #deck2 #deck3.",
    "Convert folders to decks and subdecks?": "Convert folders to decks and subdecks?",
    "This is an alternative to the Flashcard tags option above.": "This is an alternative to the Flashcard tags option above.",
    "Save scheduling comment on the same line as the flashcard's last line?": "Save scheduling comment on the same line as the flashcard's last line?",
    "Turning this on will make the HTML comments not break list formatting.": "Turning this on will make the HTML comments not break list formatting.",
    "Bury sibling cards until the next day?": "Bury sibling cards until the next day?",
    "Siblings are cards generated from the same card text i.e. cloze deletions": "Siblings are cards generated from the same card text i.e. cloze deletions",
    "Show context in cards?": "Show context in cards?",
    "i.e. Title > Heading 1 > Subheading > ... > Subheading": "i.e. Title > Heading 1 > Subheading > ... > Subheading",
    "Flashcard Height Percentage": "Flashcard Height Percentage",
    "Should be set to 100% on mobile or if you have very large images": "Should be set to 100% on mobile or if you have very large images",
    "Reset to default": "Reset to default",
    "Flashcard Width Percentage": "Flashcard Width Percentage",
    "Show file name instead of 'Open file' in flashcard review?": "Show file name instead of 'Open file' in flashcard review?",
    "Randomize card order during review?": "Randomize card order during review?",
    "Disable cloze cards?": "Disable cloze cards?",
    "If you're not currently using 'em & would like the plugin to run a tad faster.": "If you're not currently using 'em & would like the plugin to run a tad faster.",
    "Separator for inline flashcards": "Separator for inline flashcards",
    "Separator for inline reversed flashcards": "Separator for inline reversed flashcards",
    "Separator for multiline reversed flashcards": "Separator for multiline reversed flashcards",
    "Note that after changing this you have to manually edit any flashcards you already have.": "Note that after changing this you have to manually edit any flashcards you already have.",
    "Separator for multiline flashcards": "Separator for multiline flashcards",
    "Clear cache?": "Clear cache?",
    "Clear cache": "Clear cache",
    "Cache cleared": "Cache cleared",
    "If you're having issues seeing some cards, try this.": "If you're having issues seeing some cards, try this.",
    "Tags to review": "Tags to review",
    "Enter tags separated by spaces or newlines i.e. #review #tag2 #tag3.": "Enter tags separated by spaces or newlines i.e. #review #tag2 #tag3.",
    "Open a random note for review": "Open a random note for review",
    "When you turn this off, notes are ordered by importance (PageRank).": "When you turn this off, notes are ordered by importance (PageRank).",
    "Open next note automatically after a review": "Open next note automatically after a review",
    "For faster reviews.": "For faster reviews.",
    "Disable review options in the file menu i.e. Review: Easy Good Hard": "Disable review options in the file menu i.e. Review: Easy Good Hard",
    "After disabling, you can review using the command hotkeys. Reload Obsidian after changing this.": "After disabling, you can review using the command hotkeys. Reload Obsidian after changing this.",
    "Maximum number of days to display on right panel": "Maximum number of days to display on right panel",
    "Reduce this for a cleaner interface.": "Reduce this for a cleaner interface.",
    "The number of days must be at least 1.": "The number of days must be at least 1.",
    "Please provide a valid number.": "Please provide a valid number.",
    Algorithm: "Algorithm",
    "Base ease": "Base ease",
    "minimum = 130, preferrably approximately 250.": "minimum = 130, preferrably approximately 250.",
    "The base ease must be at least 130.": "The base ease must be at least 130.",
    "Interval change when you review a flashcard/note as hard": "Interval change when you review a flashcard/note as hard",
    "newInterval = oldInterval * intervalChange / 100.": "newInterval = oldInterval * intervalChange / 100.",
    "Easy bonus": "Easy bonus",
    "The easy bonus allows you to set the difference in intervals between answering Good and Easy on a flashcard/note (minimum = 100%).": "The easy bonus allows you to set the difference in intervals between answering Good and Easy on a flashcard/note (minimum = 100%).",
    "The easy bonus must be at least 100.": "The easy bonus must be at least 100.",
    "Maximum Interval": "Maximum Interval",
    "Allows you to place an upper limit on the interval (default = 100 years).": "Allows you to place an upper limit on the interval (default = 100 years).",
    "The maximum interval must be at least 1 day.": "The maximum interval must be at least 1 day.",
    "Maximum link contribution": "Maximum link contribution",
    "Maximum contribution of the weighted ease of linked notes to the initial ease.": "Maximum contribution of the weighted ease of linked notes to the initial ease.",
    // sidebar.ts
    New: "New",
    Yesterday: "Yesterday",
    Today: "Today",
    Tomorrow: "Tomorrow",
    "Notes Review Queue": "Notes Review Queue",
    Close: "Close",
    // stats-modal.ts
    Statistics: "Statistics",
    "Note that this requires the Obsidian Charts plugin to work": "Note that this requires the Obsidian Charts plugin to work",
    Forecast: "Forecast",
    "The number of cards due in the future": "The number of cards due in the future",
    "Number of cards": "Number of cards",
    Scheduled: "Scheduled",
    Review: "Review",
    due: "due",
    Days: "Days",
    "Folders to ignore": "Folders to ignore",
    "Enter folder paths separated by newlines i.e. Templates Meta/Scripts": "Enter folder paths separated by newlines i.e. Templates Meta/Scripts",
    "Note is saved under ignored folder (check settings).": "Note is saved under ignored folder (check settings).",
};

// British English
var enGB = {};

// Español
var es = {};

// français
var fr = {};

// हिन्दी
var hi = {};

// Bahasa Indonesia
var id = {};

// Italiano
var it = {};

// 日本語
var ja = {};

// 한국어
var ko = {};

// Nederlands
var nl = {};

// Norsk
var no = {};

// język polski
var pl = {};

// Português
var pt = {};

// Português do Brasil
// Brazilian Portuguese
var ptBR = {};

// Română
var ro = {};

// русский
var ru = {};

// Türkçe
var tr = {};

// 简体中文
var zhCN = {};

// 繁體中文
var zhTW = {};

// https://github.com/mgmeyers/obsidian-kanban/blob/93014c2512507fde9eafd241e8d4368a8dfdf853/src/lang/helpers.ts
const localeMap = {
    ar,
    cs: cz,
    da,
    de,
    en,
    "en-gb": enGB,
    es,
    fr,
    hi,
    id,
    it,
    ja,
    ko,
    nl,
    nn: no,
    pl,
    pt,
    "pt-br": ptBR,
    ro,
    ru,
    tr,
    "zh-cn": zhCN,
    "zh-tw": zhTW,
};
const locale = localeMap[obsidian.moment.locale()];
function t(str) {
    if (!locale) {
        console.error("Error: SRS locale not found", obsidian.moment.locale());
    }
    return (locale && locale[str]) || en[str];
}

const DEFAULT_SETTINGS = {
    // flashcards
    flashcardTags: ["#flashcards"],
    convertFoldersToDecks: false,
    cardCommentOnSameLine: false,
    burySiblingCards: false,
    showContextInCards: true,
    flashcardHeightPercentage: obsidian.Platform.isMobile ? 100 : 80,
    flashcardWidthPercentage: obsidian.Platform.isMobile ? 100 : 40,
    showFileNameInFileLink: false,
    randomizeCardOrder: true,
    disableClozeCards: false,
    singlelineCardSeparator: "::",
    singlelineReversedCardSeparator: ":::",
    multilineCardSeparator: "?",
    multilineReversedCardSeparator: "??",
    // notes
    tagsToReview: ["#review"],
    noteFoldersToIgnore: [],
    openRandomNote: false,
    autoNextNote: false,
    disableFileMenuReviewOptions: false,
    maxNDaysNotesReviewQueue: 365,
    // algorithm
    baseEase: 250,
    lapsesIntervalChange: 0.5,
    easyBonus: 1.3,
    maximumInterval: 36525,
    maxLinkFactor: 1.0,
    // logging
    logLevel: LogLevel.Warn,
};
// https://github.com/mgmeyers/obsidian-kanban/blob/main/src/Settings.ts
let applyDebounceTimer = 0;
function applySettingsUpdate(callback) {
    clearTimeout(applyDebounceTimer);
    applyDebounceTimer = window.setTimeout(callback, 512);
}
class SRSettingTab extends obsidian.PluginSettingTab {
    plugin;
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createDiv().innerHTML =
            "<h2>" + t("Spaced Repetition Plugin - Settings") + "</h2>";
        containerEl.createDiv().innerHTML =
            t("For more information, check the") +
                ' <a href="https://github.com/st3v3nmw/obsidian-spaced-repetition/wiki">' +
                t("wiki") +
                "</a>.";
        new obsidian.Setting(containerEl)
            .setName(t("Folders to ignore"))
            .setDesc(t("Enter folder paths separated by newlines i.e. Templates Meta/Scripts"))
            .addTextArea((text) => text
            .setValue(this.plugin.data.settings.noteFoldersToIgnore.join("\n"))
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.noteFoldersToIgnore = value
                    .split(/\n+/)
                    .map((v) => v.trim())
                    .filter((v) => v);
                await this.plugin.savePluginData();
            });
        }));
        containerEl.createDiv().innerHTML = "<h3>" + t("Flashcards") + "</h3>";
        new obsidian.Setting(containerEl)
            .setName(t("Flashcard tags"))
            .setDesc(t("Enter tags separated by spaces or newlines i.e. #flashcards #deck2 #deck3."))
            .addTextArea((text) => text
            .setValue(this.plugin.data.settings.flashcardTags.join(" "))
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.flashcardTags = value.split(/\s+/);
                await this.plugin.savePluginData();
            });
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Convert folders to decks and subdecks?"))
            .setDesc(t("This is an alternative to the Flashcard tags option above."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.convertFoldersToDecks)
            .onChange(async (value) => {
            this.plugin.data.settings.convertFoldersToDecks = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Save scheduling comment on the same line as the flashcard's last line?"))
            .setDesc(t("Turning this on will make the HTML comments not break list formatting."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.cardCommentOnSameLine)
            .onChange(async (value) => {
            this.plugin.data.settings.cardCommentOnSameLine = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Bury sibling cards until the next day?"))
            .setDesc(t("Siblings are cards generated from the same card text i.e. cloze deletions"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.burySiblingCards)
            .onChange(async (value) => {
            this.plugin.data.settings.burySiblingCards = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Show context in cards?"))
            .setDesc(t("i.e. Title > Heading 1 > Subheading > ... > Subheading"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.showContextInCards)
            .onChange(async (value) => {
            this.plugin.data.settings.showContextInCards = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Flashcard Height Percentage"))
            .setDesc(t("Should be set to 100% on mobile or if you have very large images"))
            .addSlider((slider) => slider
            .setLimits(10, 100, 5)
            .setValue(this.plugin.data.settings.flashcardHeightPercentage)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.flashcardHeightPercentage = value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.flashcardHeightPercentage =
                    DEFAULT_SETTINGS.flashcardHeightPercentage;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Flashcard Width Percentage"))
            .setDesc(t("Should be set to 100% on mobile or if you have very large images"))
            .addSlider((slider) => slider
            .setLimits(10, 100, 5)
            .setValue(this.plugin.data.settings.flashcardWidthPercentage)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.flashcardWidthPercentage = value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.flashcardWidthPercentage =
                    DEFAULT_SETTINGS.flashcardWidthPercentage;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Show file name instead of 'Open file' in flashcard review?"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.showFileNameInFileLink)
            .onChange(async (value) => {
            this.plugin.data.settings.showFileNameInFileLink = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Randomize card order during review?"))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.randomizeCardOrder)
            .onChange(async (value) => {
            this.plugin.data.settings.randomizeCardOrder = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Disable cloze cards?"))
            .setDesc(t("If you're not currently using 'em & would like the plugin to run a tad faster."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.disableClozeCards)
            .onChange(async (value) => {
            this.plugin.data.settings.disableClozeCards = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Separator for inline flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.singlelineCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.singlelineCardSeparator = value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.singlelineCardSeparator =
                    DEFAULT_SETTINGS.singlelineCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Separator for inline reversed flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.singlelineReversedCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.singlelineReversedCardSeparator = value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.singlelineReversedCardSeparator =
                    DEFAULT_SETTINGS.singlelineReversedCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Separator for multiline flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.multilineCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.multilineCardSeparator = value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.multilineCardSeparator =
                    DEFAULT_SETTINGS.multilineCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Separator for multiline reversed flashcards"))
            .setDesc(t("Note that after changing this you have to manually edit any flashcards you already have."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.multilineReversedCardSeparator)
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.multilineReversedCardSeparator = value;
                await this.plugin.savePluginData();
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.multilineReversedCardSeparator =
                    DEFAULT_SETTINGS.multilineReversedCardSeparator;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Clear cache?"))
            .setDesc(t("If you're having issues seeing some cards, try this."))
            .addButton((button) => {
            button.setButtonText(t("Clear cache")).onClick(async () => {
                this.plugin.data.cache = {};
                await this.plugin.savePluginData();
                new obsidian.Notice(t("Cache cleared"));
            });
        });
        containerEl.createDiv().innerHTML = "<h3>" + t("Notes") + "</h3>";
        new obsidian.Setting(containerEl)
            .setName(t("Tags to review"))
            .setDesc(t("Enter tags separated by spaces or newlines i.e. #review #tag2 #tag3."))
            .addTextArea((text) => text
            .setValue(this.plugin.data.settings.tagsToReview.join(" "))
            .onChange((value) => {
            applySettingsUpdate(async () => {
                this.plugin.data.settings.tagsToReview = value.split(/\s+/);
                await this.plugin.savePluginData();
            });
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Open a random note for review"))
            .setDesc(t("When you turn this off, notes are ordered by importance (PageRank)."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.openRandomNote)
            .onChange(async (value) => {
            this.plugin.data.settings.openRandomNote = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Open next note automatically after a review"))
            .setDesc(t("For faster reviews."))
            .addToggle((toggle) => toggle.setValue(this.plugin.data.settings.autoNextNote).onChange(async (value) => {
            this.plugin.data.settings.autoNextNote = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Disable review options in the file menu i.e. Review: Easy Good Hard"))
            .setDesc(t("After disabling, you can review using the command hotkeys. Reload Obsidian after changing this."))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.data.settings.disableFileMenuReviewOptions)
            .onChange(async (value) => {
            this.plugin.data.settings.disableFileMenuReviewOptions = value;
            await this.plugin.savePluginData();
        }));
        new obsidian.Setting(containerEl)
            .setName(t("Maximum number of days to display on right panel"))
            .setDesc(t("Reduce this for a cleaner interface."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.maxNDaysNotesReviewQueue.toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value);
                if (!isNaN(numValue)) {
                    if (numValue < 1) {
                        new obsidian.Notice(t("The number of days must be at least 1."));
                        text.setValue(this.plugin.data.settings.maxNDaysNotesReviewQueue.toString());
                        return;
                    }
                    this.plugin.data.settings.maxNDaysNotesReviewQueue = numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.maxNDaysNotesReviewQueue =
                    DEFAULT_SETTINGS.maxNDaysNotesReviewQueue;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        containerEl.createDiv().innerHTML = "<h3>" + t("Algorithm") + "</h3>";
        containerEl.createDiv().innerHTML =
            t("For more information, check the") +
                ' <a href="https://github.com/st3v3nmw/obsidian-spaced-repetition/wiki/Spaced-Repetition-Algorithm">' +
                t("algorithm implementation") +
                "</a>.";
        new obsidian.Setting(containerEl)
            .setName(t("Base ease"))
            .setDesc(t("minimum = 130, preferrably approximately 250."))
            .addText((text) => text.setValue(this.plugin.data.settings.baseEase.toString()).onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value);
                if (!isNaN(numValue)) {
                    if (numValue < 130) {
                        new obsidian.Notice(t("The base ease must be at least 130."));
                        text.setValue(this.plugin.data.settings.baseEase.toString());
                        return;
                    }
                    this.plugin.data.settings.baseEase = numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.baseEase = DEFAULT_SETTINGS.baseEase;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Interval change when you review a flashcard/note as hard"))
            .setDesc(t("newInterval = oldInterval * intervalChange / 100."))
            .addSlider((slider) => slider
            .setLimits(1, 99, 1)
            .setValue(this.plugin.data.settings.lapsesIntervalChange * 100)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.lapsesIntervalChange = value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.lapsesIntervalChange =
                    DEFAULT_SETTINGS.lapsesIntervalChange;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Easy bonus"))
            .setDesc(t("The easy bonus allows you to set the difference in intervals between answering Good and Easy on a flashcard/note (minimum = 100%)."))
            .addText((text) => text
            .setValue((this.plugin.data.settings.easyBonus * 100).toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value) / 100;
                if (!isNaN(numValue)) {
                    if (numValue < 1.0) {
                        new obsidian.Notice(t("The easy bonus must be at least 100."));
                        text.setValue((this.plugin.data.settings.easyBonus * 100).toString());
                        return;
                    }
                    this.plugin.data.settings.easyBonus = numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.easyBonus = DEFAULT_SETTINGS.easyBonus;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Maximum Interval"))
            .setDesc(t("Allows you to place an upper limit on the interval (default = 100 years)."))
            .addText((text) => text
            .setValue(this.plugin.data.settings.maximumInterval.toString())
            .onChange((value) => {
            applySettingsUpdate(async () => {
                let numValue = Number.parseInt(value);
                if (!isNaN(numValue)) {
                    if (numValue < 1) {
                        new obsidian.Notice(t("The maximum interval must be at least 1 day."));
                        text.setValue(this.plugin.data.settings.maximumInterval.toString());
                        return;
                    }
                    this.plugin.data.settings.maximumInterval = numValue;
                    await this.plugin.savePluginData();
                }
                else {
                    new obsidian.Notice(t("Please provide a valid number."));
                }
            });
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.maximumInterval =
                    DEFAULT_SETTINGS.maximumInterval;
                await this.plugin.savePluginData();
                this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName(t("Maximum link contribution"))
            .setDesc(t("Maximum contribution of the weighted ease of linked notes to the initial ease."))
            .addSlider((slider) => slider
            .setLimits(0, 100, 1)
            .setValue(this.plugin.data.settings.maxLinkFactor * 100)
            .setDynamicTooltip()
            .onChange(async (value) => {
            this.plugin.data.settings.maxLinkFactor = value;
            await this.plugin.savePluginData();
        }))
            .addExtraButton((button) => {
            button
                .setIcon("reset")
                .setTooltip(t("Reset to default"))
                .onClick(async () => {
                this.plugin.data.settings.maxLinkFactor = DEFAULT_SETTINGS.maxLinkFactor;
                await this.plugin.savePluginData();
                this.display();
            });
        });
    }
}

var ReviewResponse;
(function (ReviewResponse) {
    ReviewResponse[ReviewResponse["Easy"] = 0] = "Easy";
    ReviewResponse[ReviewResponse["Good"] = 1] = "Good";
    ReviewResponse[ReviewResponse["Hard"] = 2] = "Hard";
    ReviewResponse[ReviewResponse["Reset"] = 3] = "Reset";
})(ReviewResponse || (ReviewResponse = {}));
function schedule(response, interval, ease, delayBeforeReview, settingsObj, dueDates) {
    delayBeforeReview = Math.max(0, Math.floor(delayBeforeReview / (24 * 3600 * 1000)));
    if (response === ReviewResponse.Easy) {
        ease += 20;
        interval = ((interval + delayBeforeReview) * ease) / 100;
        interval *= settingsObj.easyBonus;
    }
    else if (response === ReviewResponse.Good) {
        interval = ((interval + delayBeforeReview / 2) * ease) / 100;
    }
    else if (response === ReviewResponse.Hard) {
        ease = Math.max(130, ease - 20);
        interval = Math.max(1, (interval + delayBeforeReview / 4) * settingsObj.lapsesIntervalChange);
    }
    // replaces random fuzz with load balancing over the fuzz interval
    if (dueDates !== undefined) {
        interval = Math.round(interval);
        if (!dueDates.hasOwnProperty(interval)) {
            dueDates[interval] = 0;
        }
        let fuzzRange;
        // disable fuzzing for small intervals
        if (interval <= 4) {
            fuzzRange = [interval, interval];
        }
        else {
            let fuzz;
            if (interval < 7)
                fuzz = 1;
            else if (interval < 30)
                fuzz = Math.max(2, Math.floor(interval * 0.15));
            else
                fuzz = Math.max(4, Math.floor(interval * 0.05));
            fuzzRange = [interval - fuzz, interval + fuzz];
        }
        for (let ivl = fuzzRange[0]; ivl <= fuzzRange[1]; ivl++) {
            if (!dueDates.hasOwnProperty(ivl)) {
                dueDates[ivl] = 0;
            }
            if (dueDates[ivl] < dueDates[interval]) {
                interval = ivl;
            }
        }
        dueDates[interval]++;
    }
    interval = Math.min(interval, settingsObj.maximumInterval);
    return { interval: Math.round(interval * 10) / 10, ease };
}
function textInterval(interval, isMobile) {
    let m = Math.round(interval / 3) / 10, y = Math.round(interval / 36.5) / 10;
    if (isMobile) {
        if (interval < 30)
            return `${interval}d`;
        else if (interval < 365)
            return `${m}m`;
        else
            return `${y}y`;
    }
    else {
        if (interval < 30) {
            return interval === 1.0 ? "1.0 " + t("day") : interval.toString() + " " + t("days");
        }
        else if (interval < 365) {
            return m === 1.0 ? "1.0 " + t("month") : m.toString() + " " + t("months");
        }
        else {
            return y === 1.0 ? "1.0 " + t("year") : y.toString() + " " + t("years");
        }
    }
}

// https://github.com/obsidianmd/obsidian-api/issues/13
// flashcards
var CardType;
(function (CardType) {
    CardType[CardType["SingleLineBasic"] = 0] = "SingleLineBasic";
    CardType[CardType["SingleLineReversed"] = 1] = "SingleLineReversed";
    CardType[CardType["MultiLineBasic"] = 2] = "MultiLineBasic";
    CardType[CardType["MultiLineReversed"] = 3] = "MultiLineReversed";
    CardType[CardType["Cloze"] = 4] = "Cloze";
})(CardType || (CardType = {}));

const SCHEDULING_INFO_REGEX = /^---\n((?:.*\n)*)sr-due: (.+)\nsr-interval: (\d+)\nsr-ease: (\d+)\n((?:.*\n)*)---/;
const YAML_FRONT_MATTER_REGEX = /^---\n((?:.*\n)*?)---/;
const MULTI_SCHEDULING_EXTRACTOR = /!([\d-]+),(\d+),(\d+)/gm;
const LEGACY_SCHEDULING_EXTRACTOR = /<!--SR:([\d-]+),(\d+),(\d+)-->/gm;
const CROSS_HAIRS_ICON = `<path style=" stroke:none;fill-rule:nonzero;fill:currentColor;fill-opacity:1;" d="M 99.921875 47.941406 L 93.074219 47.941406 C 92.84375 42.03125 91.390625 36.238281 88.800781 30.921875 L 85.367188 32.582031 C 87.667969 37.355469 88.964844 42.550781 89.183594 47.84375 L 82.238281 47.84375 C 82.097656 44.617188 81.589844 41.417969 80.734375 38.304688 L 77.050781 39.335938 C 77.808594 42.089844 78.261719 44.917969 78.40625 47.769531 L 65.871094 47.769531 C 64.914062 40.507812 59.144531 34.832031 51.871094 33.996094 L 51.871094 21.386719 C 54.816406 21.507812 57.742188 21.960938 60.585938 22.738281 L 61.617188 19.058594 C 58.4375 18.191406 55.164062 17.691406 51.871094 17.570312 L 51.871094 10.550781 C 57.164062 10.769531 62.355469 12.066406 67.132812 14.363281 L 68.789062 10.929688 C 63.5 8.382812 57.738281 6.953125 51.871094 6.734375 L 51.871094 0.0390625 L 48.054688 0.0390625 L 48.054688 6.734375 C 42.179688 6.976562 36.417969 8.433594 31.132812 11.007812 L 32.792969 14.441406 C 37.566406 12.140625 42.761719 10.84375 48.054688 10.625 L 48.054688 17.570312 C 44.828125 17.714844 41.628906 18.21875 38.515625 19.078125 L 39.546875 22.757812 C 42.324219 21.988281 45.175781 21.53125 48.054688 21.386719 L 48.054688 34.03125 C 40.796875 34.949219 35.089844 40.679688 34.203125 47.941406 L 21.5 47.941406 C 21.632812 45.042969 22.089844 42.171875 22.855469 39.375 L 19.171875 38.34375 C 18.3125 41.457031 17.808594 44.65625 17.664062 47.882812 L 10.664062 47.882812 C 10.882812 42.589844 12.179688 37.394531 14.480469 32.621094 L 11.121094 30.921875 C 8.535156 36.238281 7.078125 42.03125 6.847656 47.941406 L 0 47.941406 L 0 51.753906 L 6.847656 51.753906 C 7.089844 57.636719 8.542969 63.402344 11.121094 68.695312 L 14.554688 67.035156 C 12.257812 62.261719 10.957031 57.066406 10.738281 51.773438 L 17.742188 51.773438 C 17.855469 55.042969 18.34375 58.289062 19.191406 61.445312 L 22.871094 60.414062 C 22.089844 57.5625 21.628906 54.632812 21.5 51.679688 L 34.203125 51.679688 C 35.058594 58.96875 40.773438 64.738281 48.054688 65.660156 L 48.054688 78.308594 C 45.105469 78.1875 42.183594 77.730469 39.335938 76.957031 L 38.304688 80.636719 C 41.488281 81.511719 44.757812 82.015625 48.054688 82.144531 L 48.054688 89.144531 C 42.761719 88.925781 37.566406 87.628906 32.792969 85.328125 L 31.132812 88.765625 C 36.425781 91.3125 42.183594 92.742188 48.054688 92.960938 L 48.054688 99.960938 L 51.871094 99.960938 L 51.871094 92.960938 C 57.75 92.71875 63.519531 91.265625 68.808594 88.6875 L 67.132812 85.253906 C 62.355469 87.550781 57.164062 88.851562 51.871094 89.070312 L 51.871094 82.125 C 55.09375 81.980469 58.292969 81.476562 61.40625 80.617188 L 60.378906 76.9375 C 57.574219 77.703125 54.695312 78.15625 51.792969 78.289062 L 51.792969 65.679688 C 59.121094 64.828125 64.910156 59.0625 65.796875 51.734375 L 78.367188 51.734375 C 78.25 54.734375 77.789062 57.710938 76.992188 60.605469 L 80.675781 61.636719 C 81.558594 58.40625 82.066406 55.082031 82.183594 51.734375 L 89.261719 51.734375 C 89.042969 57.03125 87.742188 62.222656 85.445312 66.996094 L 88.878906 68.65625 C 91.457031 63.367188 92.910156 57.597656 93.152344 51.71875 L 100 51.71875 Z M 62.019531 51.734375 C 61.183594 56.945312 57.085938 61.023438 51.871094 61.828125 L 51.871094 57.515625 L 48.054688 57.515625 L 48.054688 61.808594 C 42.910156 60.949219 38.886719 56.902344 38.058594 51.753906 L 42.332031 51.753906 L 42.332031 47.941406 L 38.058594 47.941406 C 38.886719 42.789062 42.910156 38.746094 48.054688 37.886719 L 48.054688 42.179688 L 51.871094 42.179688 L 51.871094 37.847656 C 57.078125 38.648438 61.179688 42.71875 62.019531 47.921875 L 57.707031 47.921875 L 57.707031 51.734375 Z M 62.019531 51.734375 "/>`;
const COLLAPSE_ICON = `<svg viewBox="0 0 100 100" width="8" height="8" class="right-triangle"><path fill="currentColor" stroke="currentColor" d="M94.9,20.8c-1.4-2.5-4.1-4.1-7.1-4.1H12.2c-3,0-5.7,1.6-7.1,4.1c-1.3,2.4-1.2,5.2,0.2,7.6L43.1,88c1.5,2.3,4,3.7,6.9,3.7 s5.4-1.4,6.9-3.7l37.8-59.6C96.1,26,96.2,23.2,94.9,20.8L94.9,20.8z"></path></svg>`;

/**
 * Returns an array of the keys of an object with type `(keyof T)[]`
 * instead of `string[]`
 * Please see https://stackoverflow.com/a/59459000 for more details
 *
 * @param obj - An object
 * @returns An array of the keys of `obj` with type `(keyof T)[]`
 */
const getKeysPreserveType = Object.keys;
/**
 * Escapes the input string so that it can be converted to a regex
 * while making sure that symbols like `?` and `*` aren't interpreted
 * as regex specials.
 * Please see https://stackoverflow.com/a/6969486 for more details
 *
 * @param str - The string to be escaped
 * @returns The escaped string
 */
const escapeRegexString = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/**
 * Returns the cyrb53 hash (hex string) of the input string
 * Please see https://stackoverflow.com/a/52171480 for more details
 *
 * @param str - The string to be hashed
 * @param seed - The seed for the cyrb53 function
 * @returns The cyrb53 hash (hex string) of `str` seeded using `seed`
 */
function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

var FlashcardModalMode;
(function (FlashcardModalMode) {
    FlashcardModalMode[FlashcardModalMode["DecksList"] = 0] = "DecksList";
    FlashcardModalMode[FlashcardModalMode["Front"] = 1] = "Front";
    FlashcardModalMode[FlashcardModalMode["Back"] = 2] = "Back";
    FlashcardModalMode[FlashcardModalMode["Closed"] = 3] = "Closed";
})(FlashcardModalMode || (FlashcardModalMode = {}));
class FlashcardModal extends obsidian.Modal {
    plugin;
    answerBtn;
    flashcardView;
    hardBtn;
    goodBtn;
    easyBtn;
    responseDiv;
    fileLinkView;
    resetLinkView;
    contextView;
    currentCard;
    currentCardIdx;
    currentDeck;
    checkDeck;
    mode;
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.titleEl.setText(t("Decks"));
        if (obsidian.Platform.isMobile) {
            this.contentEl.style.display = "block";
        }
        this.modalEl.style.height = this.plugin.data.settings.flashcardHeightPercentage + "%";
        this.modalEl.style.width = this.plugin.data.settings.flashcardWidthPercentage + "%";
        this.contentEl.style.position = "relative";
        this.contentEl.style.height = "92%";
        this.contentEl.addClass("sr-modal-content");
        document.body.onkeypress = (e) => {
            if (this.mode !== FlashcardModalMode.DecksList) {
                if (this.mode !== FlashcardModalMode.Closed && e.code === "KeyS") {
                    this.currentDeck.deleteFlashcardAtIndex(this.currentCardIdx, this.currentCard.isDue);
                    if (this.currentCard.cardType === CardType.Cloze) {
                        this.burySiblingCards(false);
                    }
                    this.currentDeck.nextCard(this);
                }
                else if (this.mode === FlashcardModalMode.Front &&
                    (e.code === "Space" || e.code === "Enter")) {
                    this.showAnswer();
                }
                else if (this.mode === FlashcardModalMode.Back) {
                    if (e.code === "Numpad1" || e.code === "Digit1") {
                        this.processReview(ReviewResponse.Hard);
                    }
                    else if (e.code === "Numpad2" || e.code === "Digit2" || e.code === "Space") {
                        this.processReview(ReviewResponse.Good);
                    }
                    else if (e.code === "Numpad3" || e.code === "Digit3") {
                        this.processReview(ReviewResponse.Easy);
                    }
                    else if (e.code === "Numpad0" || e.code === "Digit0") {
                        this.processReview(ReviewResponse.Reset);
                    }
                }
            }
        };
    }
    onOpen() {
        this.decksList();
    }
    onClose() {
        this.mode = FlashcardModalMode.Closed;
    }
    decksList() {
        this.mode = FlashcardModalMode.DecksList;
        this.titleEl.setText(t("Decks"));
        this.titleEl.innerHTML +=
            '<p style="margin:0px;line-height:12px;">' +
                '<span style="background-color:#4caf50;color:#ffffff;" aria-label="' +
                t("Due cards") +
                '" class="tag-pane-tag-count tree-item-flair">' +
                this.plugin.deckTree.dueFlashcardsCount +
                "</span>" +
                '<span style="background-color:#2196f3;" aria-label="' +
                t("New cards") +
                '" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.plugin.deckTree.newFlashcardsCount +
                "</span>" +
                '<span style="background-color:#ff7043;" aria-label="' +
                t("Total cards") +
                '" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.plugin.deckTree.totalFlashcards +
                "</span>" +
                "</p>";
        this.contentEl.innerHTML = "";
        this.contentEl.setAttribute("id", "sr-flashcard-view");
        for (let deck of this.plugin.deckTree.subdecks) {
            deck.render(this.contentEl, this);
        }
    }
    setupCardsView() {
        this.contentEl.innerHTML = "";
        this.fileLinkView = this.contentEl.createDiv("sr-link");
        this.fileLinkView.setText(t("Open file"));
        if (this.plugin.data.settings.showFileNameInFileLink) {
            this.fileLinkView.setAttribute("aria-label", t("Open file"));
        }
        this.fileLinkView.addEventListener("click", async (_) => {
            this.close();
            await this.plugin.app.workspace.activeLeaf.openFile(this.currentCard.note);
            let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            activeView.editor.setCursor({
                line: this.currentCard.lineNo,
                ch: 0,
            });
        });
        this.resetLinkView = this.contentEl.createDiv("sr-link");
        this.resetLinkView.setText(t("Reset card's progress"));
        this.resetLinkView.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Reset);
        });
        this.resetLinkView.style.float = "right";
        if (this.plugin.data.settings.showContextInCards) {
            this.contextView = this.contentEl.createDiv();
            this.contextView.setAttribute("id", "sr-context");
        }
        this.flashcardView = this.contentEl.createDiv("div");
        this.flashcardView.setAttribute("id", "sr-flashcard-view");
        this.responseDiv = this.contentEl.createDiv("sr-response");
        this.hardBtn = document.createElement("button");
        this.hardBtn.setAttribute("id", "sr-hard-btn");
        this.hardBtn.setText(t("Hard"));
        this.hardBtn.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Hard);
        });
        this.responseDiv.appendChild(this.hardBtn);
        this.goodBtn = document.createElement("button");
        this.goodBtn.setAttribute("id", "sr-good-btn");
        this.goodBtn.setText(t("Good"));
        this.goodBtn.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Good);
        });
        this.responseDiv.appendChild(this.goodBtn);
        this.easyBtn = document.createElement("button");
        this.easyBtn.setAttribute("id", "sr-easy-btn");
        this.easyBtn.setText(t("Easy"));
        this.easyBtn.addEventListener("click", (_) => {
            this.processReview(ReviewResponse.Easy);
        });
        this.responseDiv.appendChild(this.easyBtn);
        this.responseDiv.style.display = "none";
        this.answerBtn = this.contentEl.createDiv();
        this.answerBtn.setAttribute("id", "sr-show-answer");
        this.answerBtn.setText(t("Show Answer"));
        this.answerBtn.addEventListener("click", (_) => {
            this.showAnswer();
        });
    }
    showAnswer() {
        this.mode = FlashcardModalMode.Back;
        this.answerBtn.style.display = "none";
        this.responseDiv.style.display = "grid";
        if (this.currentCard.isDue) {
            this.resetLinkView.style.display = "inline-block";
        }
        if (this.currentCard.cardType !== CardType.Cloze) {
            let hr = document.createElement("hr");
            hr.setAttribute("id", "sr-hr-card-divide");
            this.flashcardView.appendChild(hr);
        }
        else {
            this.flashcardView.innerHTML = "";
        }
        this.renderMarkdownWrapper(this.currentCard.back, this.flashcardView);
    }
    async processReview(response) {
        let interval, ease, due;
        this.currentDeck.deleteFlashcardAtIndex(this.currentCardIdx, this.currentCard.isDue);
        if (response !== ReviewResponse.Reset) {
            // scheduled card
            if (this.currentCard.isDue) {
                let schedObj = schedule(response, this.currentCard.interval, this.currentCard.ease, this.currentCard.delayBeforeReview, this.plugin.data.settings, this.plugin.dueDatesFlashcards);
                interval = schedObj.interval;
                ease = schedObj.ease;
            }
            else {
                let schedObj = schedule(response, 1, this.plugin.data.settings.baseEase, 0, this.plugin.data.settings, this.plugin.dueDatesFlashcards);
                interval = schedObj.interval;
                ease = schedObj.ease;
            }
            due = window.moment(Date.now() + interval * 24 * 3600 * 1000);
        }
        else {
            this.currentCard.interval = 1.0;
            this.currentCard.ease = this.plugin.data.settings.baseEase;
            if (this.currentCard.isDue) {
                this.currentDeck.dueFlashcards.push(this.currentCard);
            }
            else {
                this.currentDeck.newFlashcards.push(this.currentCard);
            }
            due = window.moment(Date.now());
            new obsidian.Notice(t("Card's progress has been reset."));
            this.currentDeck.nextCard(this);
            return;
        }
        let dueString = due.format("YYYY-MM-DD");
        let fileText = await this.app.vault.read(this.currentCard.note);
        let replacementRegex = new RegExp(escapeRegexString(this.currentCard.cardText), "gm");
        let sep = this.plugin.data.settings.cardCommentOnSameLine ? " " : "\n";
        // Override separator if last block is a codeblock
        if (this.currentCard.cardText.endsWith("```") && sep !== "\n") {
            sep = "\n";
        }
        // check if we're adding scheduling information to the flashcard
        // for the first time
        if (this.currentCard.cardText.lastIndexOf("<!--SR:") === -1) {
            this.currentCard.cardText =
                this.currentCard.cardText + sep + `<!--SR:!${dueString},${interval},${ease}-->`;
        }
        else {
            let scheduling = [
                ...this.currentCard.cardText.matchAll(MULTI_SCHEDULING_EXTRACTOR),
            ];
            if (scheduling.length === 0) {
                scheduling = [...this.currentCard.cardText.matchAll(LEGACY_SCHEDULING_EXTRACTOR)];
            }
            let currCardSched = ["0", dueString, interval.toString(), ease.toString()];
            if (this.currentCard.isDue) {
                scheduling[this.currentCard.siblingIdx] = currCardSched;
            }
            else {
                scheduling.push(currCardSched);
            }
            this.currentCard.cardText = this.currentCard.cardText.replace(/<!--SR:.+-->/gm, "");
            this.currentCard.cardText += "<!--SR:";
            for (let i = 0; i < scheduling.length; i++) {
                this.currentCard.cardText += `!${scheduling[i][1]},${scheduling[i][2]},${scheduling[i][3]}`;
            }
            this.currentCard.cardText += "-->";
        }
        fileText = fileText.replace(replacementRegex, (_) => this.currentCard.cardText);
        for (let sibling of this.currentCard.siblings) {
            sibling.cardText = this.currentCard.cardText;
        }
        if (this.plugin.data.settings.burySiblingCards) {
            this.burySiblingCards(true);
        }
        await this.app.vault.modify(this.currentCard.note, fileText);
        this.currentDeck.nextCard(this);
    }
    async burySiblingCards(tillNextDay) {
        if (tillNextDay) {
            this.plugin.data.buryList.push(cyrb53(this.currentCard.cardText));
            await this.plugin.savePluginData();
        }
        for (let sibling of this.currentCard.siblings) {
            let dueIdx = this.currentDeck.dueFlashcards.indexOf(sibling);
            let newIdx = this.currentDeck.newFlashcards.indexOf(sibling);
            if (dueIdx !== -1)
                this.currentDeck.deleteFlashcardAtIndex(dueIdx, this.currentDeck.dueFlashcards[dueIdx].isDue);
            else if (newIdx !== -1)
                this.currentDeck.deleteFlashcardAtIndex(newIdx, this.currentDeck.newFlashcards[newIdx].isDue);
        }
    }
    // slightly modified version of the renderMarkdown function in
    // https://github.com/mgmeyers/obsidian-kanban/blob/main/src/KanbanView.tsx
    async renderMarkdownWrapper(markdownString, containerEl) {
        obsidian.MarkdownRenderer.renderMarkdown(markdownString, containerEl, this.currentCard.note.path, this.plugin);
        containerEl.findAll(".internal-embed").forEach((el) => {
            let src = el.getAttribute("src");
            let target = typeof src === "string" &&
                this.plugin.app.metadataCache.getFirstLinkpathDest(src, this.currentCard.note.path);
            if (target instanceof obsidian.TFile && target.extension !== "md") {
                el.innerText = "";
                el.createEl("img", {
                    attr: {
                        src: this.plugin.app.vault.getResourcePath(target),
                    },
                }, (img) => {
                    if (el.hasAttribute("width"))
                        img.setAttribute("width", el.getAttribute("width"));
                    else
                        img.setAttribute("width", "100%");
                    if (el.hasAttribute("alt"))
                        img.setAttribute("alt", el.getAttribute("alt"));
                });
                el.addClasses(["image-embed", "is-loaded"]);
            }
            // file does not exist
            // display dead link
            if (target === null) {
                el.innerText = src;
            }
        });
    }
}
class Deck {
    deckName;
    newFlashcards;
    newFlashcardsCount = 0; // counts those in subdecks too
    dueFlashcards;
    dueFlashcardsCount = 0; // counts those in subdecks too
    totalFlashcards = 0; // counts those in subdecks too
    subdecks;
    parent;
    constructor(deckName, parent) {
        this.deckName = deckName;
        this.newFlashcards = [];
        this.newFlashcardsCount = 0;
        this.dueFlashcards = [];
        this.dueFlashcardsCount = 0;
        this.totalFlashcards = 0;
        this.subdecks = [];
        this.parent = parent;
    }
    createDeck(deckPath) {
        if (deckPath.length === 0) {
            return;
        }
        let deckName = deckPath.shift();
        for (let deck of this.subdecks) {
            if (deckName === deck.deckName) {
                deck.createDeck(deckPath);
                return;
            }
        }
        let deck = new Deck(deckName, this);
        this.subdecks.push(deck);
        deck.createDeck(deckPath);
    }
    insertFlashcard(deckPath, cardObj) {
        if (cardObj.isDue) {
            this.dueFlashcardsCount++;
        }
        else {
            this.newFlashcardsCount++;
        }
        this.totalFlashcards++;
        if (deckPath.length === 0) {
            if (cardObj.isDue) {
                this.dueFlashcards.push(cardObj);
            }
            else {
                this.newFlashcards.push(cardObj);
            }
            return;
        }
        let deckName = deckPath.shift();
        for (let deck of this.subdecks) {
            if (deckName === deck.deckName) {
                deck.insertFlashcard(deckPath, cardObj);
                return;
            }
        }
    }
    // count flashcards that have either been buried
    // or aren't due yet
    countFlashcard(deckPath, n = 1) {
        this.totalFlashcards += n;
        let deckName = deckPath.shift();
        for (let deck of this.subdecks) {
            if (deckName === deck.deckName) {
                deck.countFlashcard(deckPath, n);
                return;
            }
        }
    }
    deleteFlashcardAtIndex(index, cardIsDue) {
        if (cardIsDue) {
            this.dueFlashcards.splice(index, 1);
        }
        else {
            this.newFlashcards.splice(index, 1);
        }
        let deck = this;
        while (deck !== null) {
            if (cardIsDue) {
                deck.dueFlashcardsCount--;
            }
            else {
                deck.newFlashcardsCount--;
            }
            deck = deck.parent;
        }
    }
    sortSubdecksList() {
        this.subdecks.sort((a, b) => {
            if (a.deckName < b.deckName) {
                return -1;
            }
            else if (a.deckName > b.deckName) {
                return 1;
            }
            return 0;
        });
        for (let deck of this.subdecks) {
            deck.sortSubdecksList();
        }
    }
    render(containerEl, modal) {
        let deckView = containerEl.createDiv("tree-item");
        let deckViewSelf = deckView.createDiv("tree-item-self tag-pane-tag is-clickable");
        let collapsed = true;
        let collapseIconEl = null;
        if (this.subdecks.length > 0) {
            collapseIconEl = deckViewSelf.createDiv("tree-item-icon collapse-icon");
            collapseIconEl.innerHTML = COLLAPSE_ICON;
            collapseIconEl.childNodes[0].style.transform = "rotate(-90deg)";
        }
        let deckViewInner = deckViewSelf.createDiv("tree-item-inner");
        deckViewInner.addEventListener("click", (_) => {
            modal.currentDeck = this;
            modal.checkDeck = this.parent;
            modal.setupCardsView();
            this.nextCard(modal);
        });
        let deckViewInnerText = deckViewInner.createDiv("tag-pane-tag-text");
        deckViewInnerText.innerHTML += `<span class="tag-pane-tag-self">${this.deckName}</span>`;
        let deckViewOuter = deckViewSelf.createDiv("tree-item-flair-outer");
        deckViewOuter.innerHTML +=
            '<span style="background-color:#4caf50;" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.dueFlashcardsCount +
                "</span>" +
                '<span style="background-color:#2196f3;" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.newFlashcardsCount +
                "</span>" +
                '<span style="background-color:#ff7043;" class="tag-pane-tag-count tree-item-flair sr-deck-counts">' +
                this.totalFlashcards +
                "</span>";
        let deckViewChildren = deckView.createDiv("tree-item-children");
        deckViewChildren.style.display = "none";
        if (this.subdecks.length > 0) {
            collapseIconEl.addEventListener("click", (_) => {
                if (collapsed) {
                    collapseIconEl.childNodes[0].style.transform = "";
                    deckViewChildren.style.display = "block";
                }
                else {
                    collapseIconEl.childNodes[0].style.transform =
                        "rotate(-90deg)";
                    deckViewChildren.style.display = "none";
                }
                collapsed = !collapsed;
            });
        }
        for (let deck of this.subdecks) {
            deck.render(deckViewChildren, modal);
        }
    }
    nextCard(modal) {
        if (this.newFlashcards.length + this.dueFlashcards.length === 0) {
            if (this.dueFlashcardsCount + this.newFlashcardsCount > 0) {
                for (let deck of this.subdecks) {
                    if (deck.dueFlashcardsCount + deck.newFlashcardsCount > 0) {
                        modal.currentDeck = deck;
                        deck.nextCard(modal);
                        return;
                    }
                }
            }
            if (this.parent == modal.checkDeck) {
                modal.decksList();
            }
            else {
                this.parent.nextCard(modal);
            }
            return;
        }
        modal.responseDiv.style.display = "none";
        modal.resetLinkView.style.display = "none";
        modal.titleEl.setText(`${this.deckName} - ${this.dueFlashcardsCount + this.newFlashcardsCount}`);
        modal.answerBtn.style.display = "initial";
        modal.flashcardView.innerHTML = "";
        modal.mode = FlashcardModalMode.Front;
        if (this.dueFlashcards.length > 0) {
            if (modal.plugin.data.settings.randomizeCardOrder) {
                modal.currentCardIdx = Math.floor(Math.random() * this.dueFlashcards.length);
            }
            else {
                modal.currentCardIdx = 0;
            }
            modal.currentCard = this.dueFlashcards[modal.currentCardIdx];
            modal.renderMarkdownWrapper(modal.currentCard.front, modal.flashcardView);
            let hardInterval = schedule(ReviewResponse.Hard, modal.currentCard.interval, modal.currentCard.ease, modal.currentCard.delayBeforeReview, modal.plugin.data.settings).interval;
            let goodInterval = schedule(ReviewResponse.Good, modal.currentCard.interval, modal.currentCard.ease, modal.currentCard.delayBeforeReview, modal.plugin.data.settings).interval;
            let easyInterval = schedule(ReviewResponse.Easy, modal.currentCard.interval, modal.currentCard.ease, modal.currentCard.delayBeforeReview, modal.plugin.data.settings).interval;
            if (obsidian.Platform.isMobile) {
                modal.hardBtn.setText(textInterval(hardInterval, true));
                modal.goodBtn.setText(textInterval(goodInterval, true));
                modal.easyBtn.setText(textInterval(easyInterval, true));
            }
            else {
                modal.hardBtn.setText(t("Hard") + " - " + textInterval(hardInterval, false));
                modal.goodBtn.setText(t("Good") + " - " + textInterval(goodInterval, false));
                modal.easyBtn.setText(t("Easy") + " - " + textInterval(easyInterval, false));
            }
        }
        else if (this.newFlashcards.length > 0) {
            if (modal.plugin.data.settings.randomizeCardOrder) {
                modal.currentCardIdx = Math.floor(Math.random() * this.newFlashcards.length);
            }
            else {
                modal.currentCardIdx = 0;
            }
            modal.currentCard = this.newFlashcards[modal.currentCardIdx];
            modal.renderMarkdownWrapper(modal.currentCard.front, modal.flashcardView);
            if (obsidian.Platform.isMobile) {
                modal.hardBtn.setText("1.0d");
                modal.goodBtn.setText("2.5d");
                modal.easyBtn.setText("3.5d");
            }
            else {
                modal.hardBtn.setText(t("Hard") + " - 1.0 " + t("day"));
                modal.goodBtn.setText(t("Good") + " - 2.5 " + t("days"));
                modal.easyBtn.setText(t("Easy") + " - 3.5 " + t("days"));
            }
        }
        if (modal.plugin.data.settings.showContextInCards)
            modal.contextView.setText(modal.currentCard.context);
        if (modal.plugin.data.settings.showFileNameInFileLink)
            modal.fileLinkView.setText(modal.currentCard.note.basename);
    }
}

class StatsModal extends obsidian.Modal {
    plugin;
    dueDatesFlashcards;
    constructor(app, dueDatesFlashcards, plugin) {
        super(app);
        this.plugin = plugin;
        this.dueDatesFlashcards = dueDatesFlashcards;
        this.titleEl.setText(t("Statistics"));
        this.modalEl.style.height = "100%";
        this.modalEl.style.width = "100%";
        if (obsidian.Platform.isMobile) {
            this.contentEl.style.display = "block";
        }
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.innerHTML +=
            "<div style='text-align:center'>" +
                "<span>" +
                t("Note that this requires the Obsidian Charts plugin to work") +
                "</span>" +
                "<h2 style='text-align:center'>" +
                t("Forecast") +
                "</h2>" +
                "<h4 style='text-align:center'>" +
                t("The number of cards due in the future") +
                "</h4>" +
                "</div>";
        let maxN = Math.max(...getKeysPreserveType(this.dueDatesFlashcards));
        for (let dueOffset = 0; dueOffset <= maxN; dueOffset++) {
            if (!this.dueDatesFlashcards.hasOwnProperty(dueOffset)) {
                this.dueDatesFlashcards[dueOffset] = 0;
            }
        }
        let dueDatesFlashcardsCopy = { 0: 0 };
        for (let [dueOffset, dueCount] of Object.entries(this.dueDatesFlashcards)) {
            if (dueOffset <= 0) {
                dueDatesFlashcardsCopy[0] += dueCount;
            }
            else {
                dueDatesFlashcardsCopy[dueOffset] = dueCount;
            }
        }
        let text = "```chart\n" +
            "\ttype: bar\n" +
            `\tlabels: [${Object.keys(dueDatesFlashcardsCopy)}]\n` +
            "\tseries:\n" +
            "\t\t- title: " +
            t("Scheduled") +
            `\n\t\t  data: [${Object.values(dueDatesFlashcardsCopy)}]\n` +
            "\txTitle: " +
            t("Days") +
            "\n\tyTitle: " +
            t("Number of cards") +
            "\n\tlegend: false\n" +
            "\tstacked: true\n" +
            "````";
        obsidian.MarkdownRenderer.renderMarkdown(text, contentEl, "", this.plugin);
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}

const REVIEW_QUEUE_VIEW_TYPE = "review-queue-list-view";
class ReviewQueueListView extends obsidian.ItemView {
    plugin;
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.registerEvent(this.app.workspace.on("file-open", (_) => this.redraw()));
        this.registerEvent(this.app.vault.on("rename", (_) => this.redraw()));
    }
    getViewType() {
        return REVIEW_QUEUE_VIEW_TYPE;
    }
    getDisplayText() {
        return t("Notes Review Queue");
    }
    getIcon() {
        return "crosshairs";
    }
    onHeaderMenu(menu) {
        menu.addItem((item) => {
            item.setTitle(t("Close"))
                .setIcon("cross")
                .onClick(() => {
                this.app.workspace.detachLeavesOfType(REVIEW_QUEUE_VIEW_TYPE);
            });
        });
    }
    redraw() {
        let openFile = this.app.workspace.getActiveFile();
        let rootEl = createDiv("nav-folder mod-root"), childrenEl = rootEl.createDiv("nav-folder-children");
        for (let deckKey in this.plugin.reviewDecks) {
            let deck = this.plugin.reviewDecks[deckKey];
            let deckFolderEl = this.createRightPaneFolder(childrenEl, deckKey, false, deck).getElementsByClassName("nav-folder-children")[0];
            if (deck.newNotes.length > 0) {
                let newNotesFolderEl = this.createRightPaneFolder(deckFolderEl, t("New"), !deck.activeFolders.has(t("New")), deck);
                for (let newFile of deck.newNotes) {
                    this.createRightPaneFile(newNotesFolderEl, newFile, openFile && newFile.path === openFile.path, !deck.activeFolders.has(t("New")));
                }
            }
            if (deck.scheduledNotes.length > 0) {
                let now = Date.now();
                let currUnix = -1;
                let schedFolderEl = null, folderTitle = "";
                let maxDaysToRender = this.plugin.data.settings.maxNDaysNotesReviewQueue;
                for (let sNote of deck.scheduledNotes) {
                    if (sNote.dueUnix != currUnix) {
                        let nDays = Math.ceil((sNote.dueUnix - now) / (24 * 3600 * 1000));
                        if (nDays > maxDaysToRender) {
                            break;
                        }
                        folderTitle =
                            nDays == -1
                                ? t("Yesterday")
                                : nDays == 0
                                    ? t("Today")
                                    : nDays == 1
                                        ? t("Tomorrow")
                                        : new Date(sNote.dueUnix).toDateString();
                        schedFolderEl = this.createRightPaneFolder(deckFolderEl, folderTitle, !deck.activeFolders.has(folderTitle), deck);
                        currUnix = sNote.dueUnix;
                    }
                    this.createRightPaneFile(schedFolderEl, sNote.note, openFile && sNote.note.path === openFile.path, !deck.activeFolders.has(folderTitle));
                }
            }
        }
        let contentEl = this.containerEl.children[1];
        contentEl.empty();
        contentEl.appendChild(rootEl);
    }
    createRightPaneFolder(parentEl, folderTitle, collapsed, deck) {
        let folderEl = parentEl.createDiv("nav-folder"), folderTitleEl = folderEl.createDiv("nav-folder-title"), childrenEl = folderEl.createDiv("nav-folder-children"), collapseIconEl = folderTitleEl.createDiv("nav-folder-collapse-indicator collapse-icon");
        collapseIconEl.innerHTML = COLLAPSE_ICON;
        if (collapsed) {
            collapseIconEl.childNodes[0].style.transform = "rotate(-90deg)";
        }
        folderTitleEl.createDiv("nav-folder-title-content").setText(folderTitle);
        folderTitleEl.onClickEvent((_) => {
            for (let child of childrenEl.childNodes) {
                if (child.style.display === "block" || child.style.display === "") {
                    child.style.display = "none";
                    collapseIconEl.childNodes[0].style.transform =
                        "rotate(-90deg)";
                    deck.activeFolders.delete(folderTitle);
                }
                else {
                    child.style.display = "block";
                    collapseIconEl.childNodes[0].style.transform = "";
                    deck.activeFolders.add(folderTitle);
                }
            }
        });
        return folderEl;
    }
    createRightPaneFile(folderEl, file, fileElActive, hidden) {
        let navFileEl = folderEl
            .getElementsByClassName("nav-folder-children")[0]
            .createDiv("nav-file");
        if (hidden) {
            navFileEl.style.display = "none";
        }
        let navFileTitle = navFileEl.createDiv("nav-file-title");
        if (fileElActive) {
            navFileTitle.addClass("is-active");
        }
        navFileTitle.createDiv("nav-file-title-content").setText(file.basename);
        navFileTitle.addEventListener("click", (event) => {
            event.preventDefault();
            this.app.workspace.activeLeaf.openFile(file);
            return false;
        }, false);
        navFileTitle.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            let fileMenu = new obsidian.Menu(this.app);
            this.app.workspace.trigger("file-menu", fileMenu, file, "my-context-menu", null);
            fileMenu.showAtPosition({
                x: event.pageX,
                y: event.pageY,
            });
            return false;
        }, false);
    }
}

class ReviewDeck {
    deckName;
    newNotes = [];
    scheduledNotes = [];
    activeFolders;
    constructor(name) {
        this.deckName = name;
        this.activeFolders = new Set([t("Today")]);
    }
    sortNotes(pageranks) {
        this.newNotes = this.newNotes.sort((a, b) => (pageranks[b.path] || 0) - (pageranks[a.path] || 0));
        // sort scheduled notes by date & within those days, sort them by importance
        this.scheduledNotes = this.scheduledNotes.sort((a, b) => {
            let result = a.dueUnix - b.dueUnix;
            if (result != 0) {
                return result;
            }
            return (pageranks[b.note.path] || 0) - (pageranks[a.note.path] || 0);
        });
    }
}
class ReviewDeckSelectionModal extends obsidian.FuzzySuggestModal {
    deckKeys = [];
    submitCallback;
    constructor(app, deckKeys) {
        super(app);
        this.deckKeys = deckKeys;
    }
    getItems() {
        return this.deckKeys;
    }
    getItemText(item) {
        return item;
    }
    onChooseItem(deckKey, _) {
        this.close();
        this.submitCallback(deckKey);
    }
}

/**
 * Returns flashcards found in `text`
 *
 * @param text - The text to extract flashcards from
 * @param singlelineCardSeparator - Separator for inline basic cards
 * @param singlelineReversedCardSeparator - Separator for inline reversed cards
 * @param multilineCardSeparator - Separator for multiline basic cards
 * @param multilineReversedCardSeparator - Separator for multiline basic card
 * @returns An array of [CardType, card text, line number] tuples
 */
function parse(text, singlelineCardSeparator, singlelineReversedCardSeparator, multilineCardSeparator, multilineReversedCardSeparator) {
    let cardText = "";
    let cards = [];
    let cardType = null;
    let lineNo = 0;
    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length === 0) {
            if (cardType) {
                cards.push([cardType, cardText, lineNo]);
                cardType = null;
            }
            cardText = "";
            continue;
        }
        else if (lines[i].startsWith("<!--") && !lines[i].startsWith("<!--SR:")) {
            while (i + 1 < lines.length && !lines[i + 1].includes("-->"))
                i++;
            i++;
            continue;
        }
        if (cardText.length > 0) {
            cardText += "\n";
        }
        cardText += lines[i];
        if (lines[i].includes(singlelineReversedCardSeparator) ||
            lines[i].includes(singlelineCardSeparator)) {
            cardType = lines[i].includes(singlelineReversedCardSeparator)
                ? CardType.SingleLineReversed
                : CardType.SingleLineBasic;
            cardText = lines[i];
            lineNo = i;
            if (i + 1 < lines.length && lines[i + 1].startsWith("<!--SR:")) {
                cardText += "\n" + lines[i + 1];
                i++;
            }
            cards.push([cardType, cardText, lineNo]);
            cardType = null;
            cardText = "";
        }
        else if (cardType === null && /==.*?==/gm.test(lines[i])) {
            cardType = CardType.Cloze;
            lineNo = i;
        }
        else if (lines[i] === multilineCardSeparator) {
            cardType = CardType.MultiLineBasic;
            lineNo = i;
        }
        else if (lines[i] === multilineReversedCardSeparator) {
            cardType = CardType.MultiLineReversed;
            lineNo = i;
        }
        else if (lines[i].startsWith("```")) {
            while (i + 1 < lines.length && !lines[i + 1].startsWith("```")) {
                i++;
                cardText += "\n" + lines[i];
            }
            cardText += "\n" + "```";
            i++;
        }
    }
    if (cardType && cardText) {
        cards.push([cardType, cardText, lineNo]);
    }
    return cards;
}

const DEFAULT_DATA = {
    settings: DEFAULT_SETTINGS,
    buryDate: "",
    buryList: [],
    cache: {},
};
class SRPlugin extends obsidian.Plugin {
    statusBar;
    reviewQueueView;
    data;
    logger;
    reviewDecks = {};
    lastSelectedReviewDeck;
    newNotes = [];
    scheduledNotes = [];
    easeByPath = {};
    incomingLinks = {};
    pageranks = {};
    dueNotesCount = 0;
    dueDatesNotes = {}; // Record<# of days in future, due count>
    deckTree = new Deck("root", null);
    dueDatesFlashcards = {}; // Record<# of days in future, due count>
    // prevent calling these functions if another instance is already running
    notesSyncLock = false;
    flashcardsSyncLock = false;
    async onload() {
        await this.loadPluginData();
        this.logger = createLogger(console, this.data.settings.logLevel);
        obsidian.addIcon("crosshairs", CROSS_HAIRS_ICON);
        this.statusBar = this.addStatusBarItem();
        this.statusBar.classList.add("mod-clickable");
        this.statusBar.setAttribute("aria-label", t("Open a note for review"));
        this.statusBar.setAttribute("aria-label-position", "top");
        this.statusBar.addEventListener("click", (_) => {
            if (!this.notesSyncLock) {
                this.sync();
                this.reviewNextNoteModal();
            }
        });
        this.addRibbonIcon("crosshairs", t("Review flashcards"), async () => {
            if (!this.flashcardsSyncLock) {
                await this.flashcards_sync();
                new FlashcardModal(this.app, this).open();
            }
        });
        this.registerView(REVIEW_QUEUE_VIEW_TYPE, (leaf) => (this.reviewQueueView = new ReviewQueueListView(leaf, this)));
        if (!this.data.settings.disableFileMenuReviewOptions) {
            this.registerEvent(this.app.workspace.on("file-menu", (menu, fileish) => {
                if (fileish instanceof obsidian.TFile && fileish.extension === "md") {
                    menu.addItem((item) => {
                        item.setTitle(t("Review: Easy"))
                            .setIcon("crosshairs")
                            .onClick((_) => {
                            this.saveReviewResponse(fileish, ReviewResponse.Easy);
                        });
                    });
                    menu.addItem((item) => {
                        item.setTitle(t("Review: Good"))
                            .setIcon("crosshairs")
                            .onClick((_) => {
                            this.saveReviewResponse(fileish, ReviewResponse.Good);
                        });
                    });
                    menu.addItem((item) => {
                        item.setTitle(t("Review: Hard"))
                            .setIcon("crosshairs")
                            .onClick((_) => {
                            this.saveReviewResponse(fileish, ReviewResponse.Hard);
                        });
                    });
                }
            }));
        }
        this.addCommand({
            id: "srs-note-review-open-note",
            name: t("Open a note for review"),
            callback: () => {
                if (!this.notesSyncLock) {
                    this.sync();
                    this.reviewNextNoteModal();
                }
            },
        });
        this.addCommand({
            id: "srs-note-review-easy",
            name: t("Review note as easy"),
            callback: () => {
                const openFile = this.app.workspace.getActiveFile();
                if (openFile && openFile.extension === "md")
                    this.saveReviewResponse(openFile, ReviewResponse.Easy);
            },
        });
        this.addCommand({
            id: "srs-note-review-good",
            name: t("Review note as good"),
            callback: () => {
                const openFile = this.app.workspace.getActiveFile();
                if (openFile && openFile.extension === "md")
                    this.saveReviewResponse(openFile, ReviewResponse.Good);
            },
        });
        this.addCommand({
            id: "srs-note-review-hard",
            name: t("Review note as hard"),
            callback: () => {
                const openFile = this.app.workspace.getActiveFile();
                if (openFile && openFile.extension === "md")
                    this.saveReviewResponse(openFile, ReviewResponse.Hard);
            },
        });
        this.addCommand({
            id: "srs-review-flashcards",
            name: t("Review flashcards"),
            callback: async () => {
                if (!this.flashcardsSyncLock) {
                    await this.flashcards_sync();
                    new FlashcardModal(this.app, this).open();
                }
            },
        });
        this.addCommand({
            id: "srs-view-stats",
            name: t("View statistics"),
            callback: async () => {
                if (!this.flashcardsSyncLock) {
                    await this.flashcards_sync();
                    new StatsModal(this.app, this.dueDatesFlashcards, this).open();
                }
            },
        });
        this.addSettingTab(new SRSettingTab(this.app, this));
        this.app.workspace.onLayoutReady(() => {
            this.initView();
            setTimeout(() => this.sync(), 2000);
            setTimeout(() => this.flashcards_sync(), 2000);
        });
    }
    onunload() {
        this.app.workspace.getLeavesOfType(REVIEW_QUEUE_VIEW_TYPE).forEach((leaf) => leaf.detach());
    }
    async sync() {
        if (this.notesSyncLock) {
            return;
        }
        this.notesSyncLock = true;
        let notes = this.app.vault.getMarkdownFiles();
        lib.reset();
        this.scheduledNotes = [];
        this.easeByPath = {};
        this.newNotes = [];
        this.incomingLinks = {};
        this.pageranks = {};
        this.dueNotesCount = 0;
        this.dueDatesNotes = {};
        this.reviewDecks = {};
        let now = Date.now();
        for (let note of notes) {
            if (this.incomingLinks[note.path] === undefined) {
                this.incomingLinks[note.path] = [];
            }
            let links = this.app.metadataCache.resolvedLinks[note.path] || {};
            for (let targetPath in links) {
                if (this.incomingLinks[targetPath] === undefined)
                    this.incomingLinks[targetPath] = [];
                // markdown files only
                if (targetPath.split(".").pop().toLowerCase() === "md") {
                    this.incomingLinks[targetPath].push({
                        sourcePath: note.path,
                        linkCount: links[targetPath],
                    });
                    lib.link(note.path, targetPath, links[targetPath]);
                }
            }
            if (this.data.settings.noteFoldersToIgnore.some((folder) => note.path.startsWith(folder))) {
                continue;
            }
            let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
            let frontmatter = fileCachedData.frontmatter || {};
            let tags = obsidian.getAllTags(fileCachedData) || [];
            let shouldIgnore = true;
            for (let tag of tags) {
                if (this.data.settings.tagsToReview.some((tagToReview) => tag === tagToReview || tag.startsWith(tagToReview + "/"))) {
                    if (!this.reviewDecks.hasOwnProperty(tag)) {
                        this.reviewDecks[tag] = new ReviewDeck(tag);
                    }
                    shouldIgnore = false;
                    break;
                }
            }
            if (shouldIgnore) {
                continue;
            }
            // file has no scheduling information
            if (!(frontmatter.hasOwnProperty("sr-due") &&
                frontmatter.hasOwnProperty("sr-interval") &&
                frontmatter.hasOwnProperty("sr-ease"))) {
                for (let tag of tags) {
                    if (this.reviewDecks.hasOwnProperty(tag)) {
                        this.reviewDecks[tag].newNotes.push(note);
                    }
                }
                this.newNotes.push(note);
                continue;
            }
            let dueUnix = window
                .moment(frontmatter["sr-due"], ["YYYY-MM-DD", "DD-MM-YYYY", "ddd MMM DD YYYY"])
                .valueOf();
            this.scheduledNotes.push({
                note,
                dueUnix,
            });
            for (let tag of tags) {
                if (this.reviewDecks.hasOwnProperty(tag)) {
                    this.reviewDecks[tag].scheduledNotes.push({ note, dueUnix });
                }
            }
            this.easeByPath[note.path] = frontmatter["sr-ease"];
            if (dueUnix <= now) {
                this.dueNotesCount++;
            }
            let nDays = Math.ceil((dueUnix - now) / (24 * 3600 * 1000));
            if (!this.dueDatesNotes.hasOwnProperty(nDays)) {
                this.dueDatesNotes[nDays] = 0;
            }
            this.dueDatesNotes[nDays]++;
        }
        lib.rank(0.85, 0.000001, (node, rank) => {
            this.pageranks[node] = rank * 10000;
        });
        // sort new notes by importance
        this.newNotes = this.newNotes.sort((a, b) => (this.pageranks[b.path] || 0) - (this.pageranks[a.path] || 0));
        // sort scheduled notes by date & within those days, sort them by importance
        this.scheduledNotes = this.scheduledNotes.sort((a, b) => {
            let result = a.dueUnix - b.dueUnix;
            if (result !== 0) {
                return result;
            }
            return (this.pageranks[b.note.path] || 0) - (this.pageranks[a.note.path] || 0);
        });
        for (let deckKey in this.reviewDecks) {
            this.reviewDecks[deckKey].sortNotes(this.pageranks);
        }
        let noteCountText = this.dueNotesCount === 1 ? t("note") : t("notes");
        let cardCountText = this.deckTree.dueFlashcardsCount === 1 ? t("card") : t("cards");
        this.statusBar.setText(t("Review") +
            `: ${this.dueNotesCount} ${noteCountText}, ` +
            `${this.deckTree.dueFlashcardsCount} ${cardCountText} ` +
            t("due"));
        this.reviewQueueView.redraw();
        this.notesSyncLock = false;
    }
    async saveReviewResponse(note, response) {
        let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
        let frontmatter = fileCachedData.frontmatter || {};
        let tags = obsidian.getAllTags(fileCachedData) || [];
        if (this.data.settings.noteFoldersToIgnore.some((folder) => note.path.startsWith(folder))) {
            new obsidian.Notice(t("Note is saved under ignored folder (check settings)."));
            return;
        }
        let shouldIgnore = true;
        for (let tag of tags) {
            if (this.data.settings.tagsToReview.some((tagToReview) => tag === tagToReview || tag.startsWith(tagToReview + "/"))) {
                shouldIgnore = false;
                break;
            }
        }
        if (shouldIgnore) {
            new obsidian.Notice(t("Please tag the note appropriately for reviewing (in settings)."));
            return;
        }
        let fileText = await this.app.vault.read(note);
        let ease, interval, delayBeforeReview, now = Date.now();
        // new note
        if (!(frontmatter.hasOwnProperty("sr-due") &&
            frontmatter.hasOwnProperty("sr-interval") &&
            frontmatter.hasOwnProperty("sr-ease"))) {
            let linkTotal = 0, linkPGTotal = 0, totalLinkCount = 0;
            for (let statObj of this.incomingLinks[note.path] || []) {
                let ease = this.easeByPath[statObj.sourcePath];
                if (ease) {
                    linkTotal += statObj.linkCount * this.pageranks[statObj.sourcePath] * ease;
                    linkPGTotal += this.pageranks[statObj.sourcePath] * statObj.linkCount;
                    totalLinkCount += statObj.linkCount;
                }
            }
            let outgoingLinks = this.app.metadataCache.resolvedLinks[note.path] || {};
            for (let linkedFilePath in outgoingLinks) {
                let ease = this.easeByPath[linkedFilePath];
                if (ease) {
                    linkTotal +=
                        outgoingLinks[linkedFilePath] * this.pageranks[linkedFilePath] * ease;
                    linkPGTotal += this.pageranks[linkedFilePath] * outgoingLinks[linkedFilePath];
                    totalLinkCount += outgoingLinks[linkedFilePath];
                }
            }
            let linkContribution = this.data.settings.maxLinkFactor *
                Math.min(1.0, Math.log(totalLinkCount + 0.5) / Math.log(64));
            ease = Math.round((1.0 - linkContribution) * this.data.settings.baseEase +
                (totalLinkCount > 0
                    ? (linkContribution * linkTotal) / linkPGTotal
                    : linkContribution * this.data.settings.baseEase));
            interval = 1;
            delayBeforeReview = 0;
        }
        else {
            interval = frontmatter["sr-interval"];
            ease = frontmatter["sr-ease"];
            delayBeforeReview =
                now -
                    window
                        .moment(frontmatter["sr-due"], ["YYYY-MM-DD", "DD-MM-YYYY", "ddd MMM DD YYYY"])
                        .valueOf();
        }
        let schedObj = schedule(response, interval, ease, delayBeforeReview, this.data.settings, this.dueDatesNotes);
        interval = schedObj.interval;
        ease = schedObj.ease;
        let due = window.moment(now + interval * 24 * 3600 * 1000);
        let dueString = due.format("YYYY-MM-DD");
        // check if scheduling info exists
        if (SCHEDULING_INFO_REGEX.test(fileText)) {
            let schedulingInfo = SCHEDULING_INFO_REGEX.exec(fileText);
            fileText = fileText.replace(SCHEDULING_INFO_REGEX, `---\n${schedulingInfo[1]}sr-due: ${dueString}\n` +
                `sr-interval: ${interval}\nsr-ease: ${ease}\n` +
                `${schedulingInfo[5]}---`);
        }
        else if (YAML_FRONT_MATTER_REGEX.test(fileText)) {
            // new note with existing YAML front matter
            let existingYaml = YAML_FRONT_MATTER_REGEX.exec(fileText);
            fileText = fileText.replace(YAML_FRONT_MATTER_REGEX, `---\n${existingYaml[1]}sr-due: ${dueString}\n` +
                `sr-interval: ${interval}\nsr-ease: ${ease}\n---`);
        }
        else {
            fileText =
                `---\nsr-due: ${dueString}\nsr-interval: ${interval}\n` +
                    `sr-ease: ${ease}\n---\n\n${fileText}`;
        }
        if (this.data.settings.burySiblingCards) {
            await this.findFlashcards(note, [], true); // bury all cards in current note
            await this.savePluginData();
        }
        await this.app.vault.modify(note, fileText);
        new obsidian.Notice(t("Response received."));
        setTimeout(() => {
            if (!this.notesSyncLock) {
                this.sync();
                if (this.data.settings.autoNextNote) {
                    this.reviewNextNote(this.lastSelectedReviewDeck);
                }
            }
        }, 500);
    }
    async reviewNextNoteModal() {
        let reviewDeckNames = Object.keys(this.reviewDecks);
        if (reviewDeckNames.length === 1) {
            this.reviewNextNote(reviewDeckNames[0]);
        }
        else {
            let deckSelectionModal = new ReviewDeckSelectionModal(this.app, reviewDeckNames);
            deckSelectionModal.submitCallback = (deckKey) => this.reviewNextNote(deckKey);
            deckSelectionModal.open();
        }
    }
    async reviewNextNote(deckKey) {
        if (!this.reviewDecks.hasOwnProperty(deckKey)) {
            new obsidian.Notice("No deck exists for " + deckKey);
            return;
        }
        this.lastSelectedReviewDeck = deckKey;
        let deck = this.reviewDecks[deckKey];
        if (deck.scheduledNotes.length > 0) {
            let index = this.data.settings.openRandomNote
                ? Math.floor(Math.random() * deck.scheduledNotes.length)
                : 0;
            this.app.workspace.activeLeaf.openFile(deck.scheduledNotes[index].note);
            return;
        }
        if (deck.newNotes.length > 0) {
            let index = this.data.settings.openRandomNote
                ? Math.floor(Math.random() * deck.newNotes.length)
                : 0;
            this.app.workspace.activeLeaf.openFile(deck.newNotes[index]);
            return;
        }
        new obsidian.Notice(t("You're all caught up now :D."));
    }
    async flashcards_sync() {
        if (this.flashcardsSyncLock) {
            return;
        }
        this.flashcardsSyncLock = true;
        let notes = this.app.vault.getMarkdownFiles();
        this.deckTree = new Deck("root", null);
        this.dueDatesFlashcards = {};
        let now = window.moment(Date.now());
        let todayDate = now.format("YYYY-MM-DD");
        // clear list if we've changed dates
        if (todayDate !== this.data.buryDate) {
            this.data.buryDate = todayDate;
            this.data.buryList = [];
        }
        let notePathsSet = new Set();
        for (let note of notes) {
            if (this.data.settings.noteFoldersToIgnore.some((folder) => note.path.startsWith(folder))) {
                continue;
            }
            notePathsSet.add(note.path);
            // find deck path
            let deckPath = [];
            if (this.data.settings.convertFoldersToDecks) {
                deckPath = note.path.split("/");
                deckPath.pop(); // remove filename
                if (deckPath.length === 0) {
                    deckPath = ["/"];
                }
            }
            else {
                let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
                let tags = obsidian.getAllTags(fileCachedData) || [];
                outer: for (let tagToReview of this.data.settings.flashcardTags) {
                    for (let tag of tags) {
                        if (tag === tagToReview || tag.startsWith(tagToReview + "/")) {
                            deckPath = tag.substring(1).split("/");
                            break outer;
                        }
                    }
                }
            }
            if (deckPath.length === 0)
                continue;
            if (this.data.cache.hasOwnProperty(note.path)) {
                let fileCache = this.data.cache[note.path];
                // Has file changed?
                if (fileCache.lastUpdated === note.stat.mtime) {
                    if (fileCache.totalCards === 0) {
                        continue;
                    }
                    else if (!fileCache.hasNewCards &&
                        now.valueOf() < window.moment(fileCache.nextDueDate, "YYYY-MM-DD").valueOf()) {
                        this.deckTree.createDeck([...deckPath]);
                        this.deckTree.countFlashcard(deckPath, fileCache.totalCards);
                    }
                    else {
                        await this.findFlashcards(note, deckPath);
                    }
                }
                else {
                    await this.findFlashcards(note, deckPath);
                }
            }
            else {
                await this.findFlashcards(note, deckPath);
            }
            for (let [nDay, count] of Object.entries(this.data.cache[note.path].dueDatesFlashcards)) {
                if (!this.dueDatesFlashcards.hasOwnProperty(nDay)) {
                    this.dueDatesFlashcards[nDay] = 0;
                }
                this.dueDatesFlashcards[nDay] += count;
            }
        }
        // remove unused cache entries
        for (let cachedPath in this.data.cache) {
            if (!notePathsSet.has(cachedPath)) {
                delete this.data.cache[cachedPath];
            }
        }
        this.logger.info(`Flashcard sync took ${Date.now() - now.valueOf()}ms`);
        await this.savePluginData();
        // sort the deck names
        this.deckTree.sortSubdecksList();
        let noteCountText = this.dueNotesCount === 1 ? t("note") : t("notes");
        let cardCountText = this.deckTree.dueFlashcardsCount === 1 ? t("card") : t("cards");
        this.statusBar.setText(t("Review") +
            `: ${this.dueNotesCount} ${noteCountText}, ` +
            `${this.deckTree.dueFlashcardsCount} ${cardCountText} ` +
            t("due"));
        this.flashcardsSyncLock = false;
    }
    async findFlashcards(note, deckPath, buryOnly = false) {
        let fileText = await this.app.vault.read(note);
        let fileCachedData = this.app.metadataCache.getFileCache(note) || {};
        let headings = fileCachedData.headings || [];
        let fileChanged = false, deckAdded = false;
        // caching information
        let hasNewCards = false, totalCards = 0, nextDueDate = Infinity, // 03:14:07 UTC, January 19 2038 haha
        dueDatesFlashcards = {};
        let now = Date.now();
        let parsedCards = parse(fileText, this.data.settings.singlelineCardSeparator, this.data.settings.singlelineReversedCardSeparator, this.data.settings.multilineCardSeparator, this.data.settings.multilineReversedCardSeparator);
        this.logger.info(parsedCards);
        for (let parsedCard of parsedCards) {
            let cardType = parsedCard[0], cardText = parsedCard[1], lineNo = parsedCard[2];
            if (cardType === CardType.Cloze && this.data.settings.disableClozeCards) {
                continue;
            }
            let cardTextHash = cyrb53(cardText);
            if (buryOnly) {
                this.data.buryList.push(cardTextHash);
                continue;
            }
            if (!deckAdded) {
                this.deckTree.createDeck([...deckPath]);
                deckAdded = true;
            }
            let siblingMatches = [];
            if (cardType === CardType.Cloze) {
                let front, back;
                for (let m of cardText.matchAll(/==(.*?)==/gm)) {
                    let deletionStart = m.index, deletionEnd = deletionStart + m[0].length;
                    front =
                        cardText.substring(0, deletionStart) +
                            "<span style='color:#2196f3'>[...]</span>" +
                            cardText.substring(deletionEnd);
                    front = front.replace(/==/gm, "");
                    back =
                        cardText.substring(0, deletionStart) +
                            "<span style='color:#2196f3'>" +
                            cardText.substring(deletionStart, deletionEnd) +
                            "</span>" +
                            cardText.substring(deletionEnd);
                    back = back.replace(/==/gm, "");
                    siblingMatches.push([front, back]);
                }
            }
            else {
                let idx;
                if (cardType === CardType.SingleLineBasic) {
                    idx = cardText.indexOf(this.data.settings.singlelineCardSeparator);
                    siblingMatches.push([
                        cardText.substring(0, idx),
                        cardText.substring(idx + this.data.settings.singlelineCardSeparator.length),
                    ]);
                }
                else if (cardType === CardType.SingleLineReversed) {
                    idx = cardText.indexOf(this.data.settings.singlelineReversedCardSeparator);
                    let side1 = cardText.substring(0, idx), side2 = cardText.substring(idx + this.data.settings.singlelineReversedCardSeparator.length);
                    siblingMatches.push([side1, side2]);
                    siblingMatches.push([side2, side1]);
                }
                else if (cardType === CardType.MultiLineBasic) {
                    idx = cardText.indexOf("\n" + this.data.settings.multilineCardSeparator + "\n");
                    siblingMatches.push([
                        cardText.substring(0, idx),
                        cardText.substring(idx + 2 + this.data.settings.multilineCardSeparator.length),
                    ]);
                }
                else if (cardType === CardType.MultiLineReversed) {
                    idx = cardText.indexOf("\n" + this.data.settings.multilineReversedCardSeparator + "\n");
                    let side1 = cardText.substring(0, idx), side2 = cardText.substring(idx + 2 + this.data.settings.multilineReversedCardSeparator.length);
                    siblingMatches.push([side1, side2]);
                    siblingMatches.push([side2, side1]);
                }
            }
            let scheduling = [...cardText.matchAll(MULTI_SCHEDULING_EXTRACTOR)];
            if (scheduling.length === 0)
                scheduling = [...cardText.matchAll(LEGACY_SCHEDULING_EXTRACTOR)];
            // we have some extra scheduling dates to delete
            if (scheduling.length > siblingMatches.length) {
                let idxSched = cardText.lastIndexOf("<!--SR:") + 7;
                let newCardText = cardText.substring(0, idxSched);
                for (let i = 0; i < siblingMatches.length; i++)
                    newCardText += `!${scheduling[i][1]},${scheduling[i][2]},${scheduling[i][3]}`;
                newCardText += "-->";
                let replacementRegex = new RegExp(escapeRegexString(cardText), "gm");
                fileText = fileText.replace(replacementRegex, (_) => newCardText);
                fileChanged = true;
            }
            let context = this.data.settings.showContextInCards
                ? getCardContext(lineNo, headings)
                : "";
            let siblings = [];
            for (let i = 0; i < siblingMatches.length; i++) {
                let front = siblingMatches[i][0].trim(), back = siblingMatches[i][1].trim();
                let cardObj = {
                    isDue: i < scheduling.length,
                    note,
                    lineNo,
                    front,
                    back,
                    cardText,
                    context,
                    cardType,
                    siblingIdx: i,
                    siblings,
                };
                totalCards++;
                // card scheduled
                if (i < scheduling.length) {
                    let dueUnix = window
                        .moment(scheduling[i][1], ["YYYY-MM-DD", "DD-MM-YYYY"])
                        .valueOf();
                    if (dueUnix < nextDueDate) {
                        nextDueDate = dueUnix;
                    }
                    let nDays = Math.ceil((dueUnix - now) / (24 * 3600 * 1000));
                    if (!dueDatesFlashcards.hasOwnProperty(nDays)) {
                        dueDatesFlashcards[nDays] = 0;
                    }
                    dueDatesFlashcards[nDays]++;
                    if (this.data.buryList.includes(cardTextHash)) {
                        this.deckTree.countFlashcard([...deckPath]);
                        continue;
                    }
                    if (dueUnix <= now) {
                        cardObj.interval = parseInt(scheduling[i][2]);
                        cardObj.ease = parseInt(scheduling[i][3]);
                        cardObj.delayBeforeReview = now - dueUnix;
                        this.deckTree.insertFlashcard([...deckPath], cardObj);
                    }
                    else {
                        this.deckTree.countFlashcard([...deckPath]);
                        continue;
                    }
                }
                else {
                    if (!hasNewCards) {
                        hasNewCards = true;
                    }
                    if (this.data.buryList.includes(cyrb53(cardText))) {
                        this.deckTree.countFlashcard([...deckPath]);
                        continue;
                    }
                    this.deckTree.insertFlashcard([...deckPath], cardObj);
                }
                siblings.push(cardObj);
            }
        }
        if (!buryOnly)
            this.data.cache[note.path] = {
                totalCards,
                hasNewCards,
                nextDueDate: nextDueDate !== Infinity ? window.moment(nextDueDate).format("YYYY-MM-DD") : "",
                lastUpdated: note.stat.mtime,
                dueDatesFlashcards,
            };
        if (fileChanged) {
            await this.app.vault.modify(note, fileText);
        }
    }
    async loadPluginData() {
        this.data = Object.assign({}, DEFAULT_DATA, await this.loadData());
        this.data.settings = Object.assign({}, DEFAULT_SETTINGS, this.data.settings);
    }
    async savePluginData() {
        await this.saveData(this.data);
    }
    initView() {
        if (this.app.workspace.getLeavesOfType(REVIEW_QUEUE_VIEW_TYPE).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: REVIEW_QUEUE_VIEW_TYPE,
            active: true,
        });
    }
}
function getCardContext(cardLine, headings) {
    let stack = [];
    for (let heading of headings) {
        if (heading.position.start.line > cardLine) {
            break;
        }
        while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
            stack.pop();
        }
        stack.push(heading);
    }
    let context = "";
    for (let headingObj of stack) {
        context += headingObj.heading + " > ";
    }
    return context.slice(0, -3);
}

module.exports = SRPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3BhZ2VyYW5rLmpzL2xpYi9pbmRleC5qcyIsInNyYy9sb2dnZXIudHMiLCJzcmMvbGFuZy9sb2NhbGUvYXIudHMiLCJzcmMvbGFuZy9sb2NhbGUvY3oudHMiLCJzcmMvbGFuZy9sb2NhbGUvZGEudHMiLCJzcmMvbGFuZy9sb2NhbGUvZGUudHMiLCJzcmMvbGFuZy9sb2NhbGUvZW4udHMiLCJzcmMvbGFuZy9sb2NhbGUvZW4tZ2IudHMiLCJzcmMvbGFuZy9sb2NhbGUvZXMudHMiLCJzcmMvbGFuZy9sb2NhbGUvZnIudHMiLCJzcmMvbGFuZy9sb2NhbGUvaGkudHMiLCJzcmMvbGFuZy9sb2NhbGUvaWQudHMiLCJzcmMvbGFuZy9sb2NhbGUvaXQudHMiLCJzcmMvbGFuZy9sb2NhbGUvamEudHMiLCJzcmMvbGFuZy9sb2NhbGUva28udHMiLCJzcmMvbGFuZy9sb2NhbGUvbmwudHMiLCJzcmMvbGFuZy9sb2NhbGUvbm8udHMiLCJzcmMvbGFuZy9sb2NhbGUvcGwudHMiLCJzcmMvbGFuZy9sb2NhbGUvcHQudHMiLCJzcmMvbGFuZy9sb2NhbGUvcHQtYnIudHMiLCJzcmMvbGFuZy9sb2NhbGUvcm8udHMiLCJzcmMvbGFuZy9sb2NhbGUvcnUudHMiLCJzcmMvbGFuZy9sb2NhbGUvdHIudHMiLCJzcmMvbGFuZy9sb2NhbGUvemgtY24udHMiLCJzcmMvbGFuZy9sb2NhbGUvemgtdHcudHMiLCJzcmMvbGFuZy9oZWxwZXJzLnRzIiwic3JjL3NldHRpbmdzLnRzIiwic3JjL3NjaGVkdWxpbmcudHMiLCJzcmMvdHlwZXMudHMiLCJzcmMvY29uc3RhbnRzLnRzIiwic3JjL3V0aWxzLnRzIiwic3JjL2ZsYXNoY2FyZC1tb2RhbC50cyIsInNyYy9zdGF0cy1tb2RhbC50cyIsInNyYy9zaWRlYmFyLnRzIiwic3JjL3Jldmlldy1kZWNrLnRzIiwic3JjL3BhcnNlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBpZiAoKHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSAmJiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2soa2V5LCBvYmplY3Rba2V5XSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0ge1xuICAgICAgICBjb3VudDogMCxcbiAgICAgICAgZWRnZXM6IHt9LFxuICAgICAgICBub2Rlczoge31cbiAgICB9O1xuXG4gICAgc2VsZi5saW5rID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCB3ZWlnaHQpIHtcbiAgICAgICAgaWYgKChpc0Zpbml0ZSh3ZWlnaHQpICE9PSB0cnVlKSB8fCAod2VpZ2h0ID09PSBudWxsKSkge1xuICAgICAgICAgICAgd2VpZ2h0ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgd2VpZ2h0ID0gcGFyc2VGbG9hdCh3ZWlnaHQpO1xuXG4gICAgICAgIGlmIChzZWxmLm5vZGVzLmhhc093blByb3BlcnR5KHNvdXJjZSkgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHNlbGYuY291bnQrKztcbiAgICAgICAgICAgIHNlbGYubm9kZXNbc291cmNlXSA9IHtcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgb3V0Ym91bmQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLm5vZGVzW3NvdXJjZV0ub3V0Ym91bmQgKz0gd2VpZ2h0O1xuXG4gICAgICAgIGlmIChzZWxmLm5vZGVzLmhhc093blByb3BlcnR5KHRhcmdldCkgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHNlbGYuY291bnQrKztcbiAgICAgICAgICAgIHNlbGYubm9kZXNbdGFyZ2V0XSA9IHtcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgb3V0Ym91bmQ6IDBcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5lZGdlcy5oYXNPd25Qcm9wZXJ0eShzb3VyY2UpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBzZWxmLmVkZ2VzW3NvdXJjZV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLmVkZ2VzW3NvdXJjZV0uaGFzT3duUHJvcGVydHkodGFyZ2V0KSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgc2VsZi5lZGdlc1tzb3VyY2VdW3RhcmdldF0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5lZGdlc1tzb3VyY2VdW3RhcmdldF0gKz0gd2VpZ2h0O1xuICAgIH07XG5cbiAgICBzZWxmLnJhbmsgPSBmdW5jdGlvbiAoYWxwaGEsIGVwc2lsb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkZWx0YSA9IDEsXG4gICAgICAgICAgICBpbnZlcnNlID0gMSAvIHNlbGYuY291bnQ7XG5cbiAgICAgICAgZm9yT3duKHNlbGYuZWRnZXMsIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLm5vZGVzW3NvdXJjZV0ub3V0Ym91bmQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yT3duKHNlbGYuZWRnZXNbc291cmNlXSwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVkZ2VzW3NvdXJjZV1bdGFyZ2V0XSAvPSBzZWxmLm5vZGVzW3NvdXJjZV0ub3V0Ym91bmQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvck93bihzZWxmLm5vZGVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBzZWxmLm5vZGVzW2tleV0ud2VpZ2h0ID0gaW52ZXJzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGRlbHRhID4gZXBzaWxvbikge1xuICAgICAgICAgICAgdmFyIGxlYWsgPSAwLFxuICAgICAgICAgICAgICAgIG5vZGVzID0ge307XG5cbiAgICAgICAgICAgIGZvck93bihzZWxmLm5vZGVzLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG5vZGVzW2tleV0gPSB2YWx1ZS53ZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUub3V0Ym91bmQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGVhayArPSB2YWx1ZS53ZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5ub2Rlc1trZXldLndlaWdodCA9IDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGVhayAqPSBhbHBoYTtcblxuICAgICAgICAgICAgZm9yT3duKHNlbGYubm9kZXMsIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBmb3JPd24oc2VsZi5lZGdlc1tzb3VyY2VdLCBmdW5jdGlvbiAodGFyZ2V0LCB3ZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5ub2Rlc1t0YXJnZXRdLndlaWdodCArPSBhbHBoYSAqIG5vZGVzW3NvdXJjZV0gKiB3ZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLm5vZGVzW3NvdXJjZV0ud2VpZ2h0ICs9ICgxIC0gYWxwaGEpICogaW52ZXJzZSArIGxlYWsgKiBpbnZlcnNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlbHRhID0gMDtcblxuICAgICAgICAgICAgZm9yT3duKHNlbGYubm9kZXMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGVsdGEgKz0gTWF0aC5hYnModmFsdWUud2VpZ2h0IC0gbm9kZXNba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvck93bihzZWxmLm5vZGVzLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soa2V5LCBzZWxmLm5vZGVzW2tleV0ud2VpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNlbGYucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuY291bnQgPSAwO1xuICAgICAgICBzZWxmLmVkZ2VzID0ge307XG4gICAgICAgIHNlbGYubm9kZXMgPSB7fTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlbGY7XG59KSgpO1xuIiwiZXhwb3J0IGVudW0gTG9nTGV2ZWwge1xuICAgIEluZm8sXG4gICAgV2FybixcbiAgICBFcnJvcixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMb2dnZXIge1xuICAgIGluZm86IEZ1bmN0aW9uO1xuICAgIHdhcm46IEZ1bmN0aW9uO1xuICAgIGVycm9yOiBGdW5jdGlvbjtcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxvZ2dlciA9IChjb25zb2xlOiBDb25zb2xlLCBsb2dMZXZlbDogTG9nTGV2ZWwpOiBMb2dnZXIgPT4ge1xuICAgIGxldCBpbmZvOiBGdW5jdGlvbiwgd2FybjogRnVuY3Rpb247XG5cbiAgICBpZiAobG9nTGV2ZWwgPT09IExvZ0xldmVsLkluZm8pXG4gICAgICAgIGluZm8gPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKGNvbnNvbGUuaW5mbywgY29uc29sZSwgXCJTUjpcIik7XG4gICAgZWxzZSBpbmZvID0gKC4uLl86IGFueVtdKSA9PiB7fTtcblxuICAgIGlmIChsb2dMZXZlbCA8PSBMb2dMZXZlbC5XYXJuKVxuICAgICAgICB3YXJuID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChjb25zb2xlLndhcm4sIGNvbnNvbGUsIFwiU1I6XCIpO1xuICAgIGVsc2Ugd2FybiA9ICguLi5fOiBhbnlbXSkgPT4ge307XG5cbiAgICBsZXQgZXJyb3I6IEZ1bmN0aW9uID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChjb25zb2xlLmVycm9yLCBjb25zb2xlLCBcIlNSOlwiKTtcblxuICAgIHJldHVybiB7IGluZm8sIHdhcm4sIGVycm9yIH07XG59O1xuIiwiLy8g2KfZhNi52LHYqNmK2KlcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyDEjWXFoXRpbmFcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBEYW5za1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIERldXRzY2hcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBFbmdsaXNoXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBmbGFzaGNhcmQtbW9kYWwudHNcbiAgICBEZWNrczogXCJEZWNrc1wiLFxuICAgIFwiT3BlbiBmaWxlXCI6IFwiT3BlbiBmaWxlXCIsXG4gICAgXCJEdWUgY2FyZHNcIjogXCJEdWUgY2FyZHNcIixcbiAgICBcIk5ldyBjYXJkc1wiOiBcIk5ldyBjYXJkc1wiLFxuICAgIFwiVG90YWwgY2FyZHNcIjogXCJUb3RhbCBjYXJkc1wiLFxuICAgIFwiUmVzZXQgY2FyZCdzIHByb2dyZXNzXCI6IFwiUmVzZXQgY2FyZCdzIHByb2dyZXNzXCIsXG4gICAgSGFyZDogXCJIYXJkXCIsXG4gICAgR29vZDogXCJHb29kXCIsXG4gICAgRWFzeTogXCJFYXN5XCIsXG4gICAgXCJTaG93IEFuc3dlclwiOiBcIlNob3cgQW5zd2VyXCIsXG4gICAgXCJDYXJkJ3MgcHJvZ3Jlc3MgaGFzIGJlZW4gcmVzZXQuXCI6IFwiQ2FyZCdzIHByb2dyZXNzIGhhcyBiZWVuIHJlc2V0LlwiLFxuXG4gICAgLy8gbWFpbi50c1xuICAgIFwiT3BlbiBhIG5vdGUgZm9yIHJldmlld1wiOiBcIk9wZW4gYSBub3RlIGZvciByZXZpZXdcIixcbiAgICBcIlJldmlldyBmbGFzaGNhcmRzXCI6IFwiUmV2aWV3IGZsYXNoY2FyZHNcIixcbiAgICBcIlJldmlldzogRWFzeVwiOiBcIlJldmlldzogRWFzeVwiLFxuICAgIFwiUmV2aWV3OiBHb29kXCI6IFwiUmV2aWV3OiBHb29kXCIsXG4gICAgXCJSZXZpZXc6IEhhcmRcIjogXCJSZXZpZXc6IEhhcmRcIixcbiAgICBcIlJldmlldyBub3RlIGFzIGVhc3lcIjogXCJSZXZpZXcgbm90ZSBhcyBlYXN5XCIsXG4gICAgXCJSZXZpZXcgbm90ZSBhcyBnb29kXCI6IFwiUmV2aWV3IG5vdGUgYXMgZ29vZFwiLFxuICAgIFwiUmV2aWV3IG5vdGUgYXMgaGFyZFwiOiBcIlJldmlldyBub3RlIGFzIGhhcmRcIixcbiAgICBcIlZpZXcgc3RhdGlzdGljc1wiOiBcIlZpZXcgc3RhdGlzdGljc1wiLFxuICAgIG5vdGU6IFwibm90ZVwiLFxuICAgIG5vdGVzOiBcIm5vdGVzXCIsXG4gICAgY2FyZDogXCJjYXJkXCIsXG4gICAgY2FyZHM6IFwiY2FyZHNcIixcbiAgICBcIlBsZWFzZSB0YWcgdGhlIG5vdGUgYXBwcm9wcmlhdGVseSBmb3IgcmV2aWV3aW5nIChpbiBzZXR0aW5ncykuXCI6XG4gICAgICAgIFwiUGxlYXNlIHRhZyB0aGUgbm90ZSBhcHByb3ByaWF0ZWx5IGZvciByZXZpZXdpbmcgKGluIHNldHRpbmdzKS5cIixcbiAgICBcIllvdSdyZSBhbGwgY2F1Z2h0IHVwIG5vdyA6RC5cIjogXCJZb3UncmUgYWxsIGNhdWdodCB1cCBub3cgOkQuXCIsXG4gICAgXCJSZXNwb25zZSByZWNlaXZlZC5cIjogXCJSZXNwb25zZSByZWNlaXZlZC5cIixcblxuICAgIC8vIHNjaGVkdWxpbmcudHNcbiAgICBkYXk6IFwiZGF5XCIsXG4gICAgZGF5czogXCJkYXlzXCIsXG4gICAgbW9udGg6IFwibW9udGhcIixcbiAgICBtb250aHM6IFwibW9udGhzXCIsXG4gICAgeWVhcjogXCJ5ZWFyXCIsXG4gICAgeWVhcnM6IFwieWVhcnNcIixcblxuICAgIC8vIHNldHRpbmdzLnRzXG4gICAgTm90ZXM6IFwiTm90ZXNcIixcbiAgICBGbGFzaGNhcmRzOiBcIkZsYXNoY2FyZHNcIixcbiAgICBcIlNwYWNlZCBSZXBldGl0aW9uIFBsdWdpbiAtIFNldHRpbmdzXCI6IFwiU3BhY2VkIFJlcGV0aXRpb24gUGx1Z2luIC0gU2V0dGluZ3NcIixcbiAgICBcIkZvciBtb3JlIGluZm9ybWF0aW9uLCBjaGVjayB0aGVcIjogXCJGb3IgbW9yZSBpbmZvcm1hdGlvbiwgY2hlY2sgdGhlXCIsXG4gICAgd2lraTogXCJ3aWtpXCIsXG4gICAgXCJhbGdvcml0aG0gaW1wbGVtZW50YXRpb25cIjogXCJhbGdvcml0aG0gaW1wbGVtZW50YXRpb25cIixcbiAgICBcIkZsYXNoY2FyZCB0YWdzXCI6IFwiRmxhc2hjYXJkIHRhZ3NcIixcbiAgICBcIkVudGVyIHRhZ3Mgc2VwYXJhdGVkIGJ5IHNwYWNlcyBvciBuZXdsaW5lcyBpLmUuICNmbGFzaGNhcmRzICNkZWNrMiAjZGVjazMuXCI6XG4gICAgICAgIFwiRW50ZXIgdGFncyBzZXBhcmF0ZWQgYnkgc3BhY2VzIG9yIG5ld2xpbmVzIGkuZS4gI2ZsYXNoY2FyZHMgI2RlY2syICNkZWNrMy5cIixcbiAgICBcIkNvbnZlcnQgZm9sZGVycyB0byBkZWNrcyBhbmQgc3ViZGVja3M/XCI6IFwiQ29udmVydCBmb2xkZXJzIHRvIGRlY2tzIGFuZCBzdWJkZWNrcz9cIixcbiAgICBcIlRoaXMgaXMgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIEZsYXNoY2FyZCB0YWdzIG9wdGlvbiBhYm92ZS5cIjpcbiAgICAgICAgXCJUaGlzIGlzIGFuIGFsdGVybmF0aXZlIHRvIHRoZSBGbGFzaGNhcmQgdGFncyBvcHRpb24gYWJvdmUuXCIsXG4gICAgXCJTYXZlIHNjaGVkdWxpbmcgY29tbWVudCBvbiB0aGUgc2FtZSBsaW5lIGFzIHRoZSBmbGFzaGNhcmQncyBsYXN0IGxpbmU/XCI6XG4gICAgICAgIFwiU2F2ZSBzY2hlZHVsaW5nIGNvbW1lbnQgb24gdGhlIHNhbWUgbGluZSBhcyB0aGUgZmxhc2hjYXJkJ3MgbGFzdCBsaW5lP1wiLFxuICAgIFwiVHVybmluZyB0aGlzIG9uIHdpbGwgbWFrZSB0aGUgSFRNTCBjb21tZW50cyBub3QgYnJlYWsgbGlzdCBmb3JtYXR0aW5nLlwiOlxuICAgICAgICBcIlR1cm5pbmcgdGhpcyBvbiB3aWxsIG1ha2UgdGhlIEhUTUwgY29tbWVudHMgbm90IGJyZWFrIGxpc3QgZm9ybWF0dGluZy5cIixcbiAgICBcIkJ1cnkgc2libGluZyBjYXJkcyB1bnRpbCB0aGUgbmV4dCBkYXk/XCI6IFwiQnVyeSBzaWJsaW5nIGNhcmRzIHVudGlsIHRoZSBuZXh0IGRheT9cIixcbiAgICBcIlNpYmxpbmdzIGFyZSBjYXJkcyBnZW5lcmF0ZWQgZnJvbSB0aGUgc2FtZSBjYXJkIHRleHQgaS5lLiBjbG96ZSBkZWxldGlvbnNcIjpcbiAgICAgICAgXCJTaWJsaW5ncyBhcmUgY2FyZHMgZ2VuZXJhdGVkIGZyb20gdGhlIHNhbWUgY2FyZCB0ZXh0IGkuZS4gY2xvemUgZGVsZXRpb25zXCIsXG4gICAgXCJTaG93IGNvbnRleHQgaW4gY2FyZHM/XCI6IFwiU2hvdyBjb250ZXh0IGluIGNhcmRzP1wiLFxuICAgIFwiaS5lLiBUaXRsZSA+IEhlYWRpbmcgMSA+IFN1YmhlYWRpbmcgPiAuLi4gPiBTdWJoZWFkaW5nXCI6XG4gICAgICAgIFwiaS5lLiBUaXRsZSA+IEhlYWRpbmcgMSA+IFN1YmhlYWRpbmcgPiAuLi4gPiBTdWJoZWFkaW5nXCIsXG4gICAgXCJGbGFzaGNhcmQgSGVpZ2h0IFBlcmNlbnRhZ2VcIjogXCJGbGFzaGNhcmQgSGVpZ2h0IFBlcmNlbnRhZ2VcIixcbiAgICBcIlNob3VsZCBiZSBzZXQgdG8gMTAwJSBvbiBtb2JpbGUgb3IgaWYgeW91IGhhdmUgdmVyeSBsYXJnZSBpbWFnZXNcIjpcbiAgICAgICAgXCJTaG91bGQgYmUgc2V0IHRvIDEwMCUgb24gbW9iaWxlIG9yIGlmIHlvdSBoYXZlIHZlcnkgbGFyZ2UgaW1hZ2VzXCIsXG4gICAgXCJSZXNldCB0byBkZWZhdWx0XCI6IFwiUmVzZXQgdG8gZGVmYXVsdFwiLFxuICAgIFwiRmxhc2hjYXJkIFdpZHRoIFBlcmNlbnRhZ2VcIjogXCJGbGFzaGNhcmQgV2lkdGggUGVyY2VudGFnZVwiLFxuICAgIFwiU2hvdyBmaWxlIG5hbWUgaW5zdGVhZCBvZiAnT3BlbiBmaWxlJyBpbiBmbGFzaGNhcmQgcmV2aWV3P1wiOlxuICAgICAgICBcIlNob3cgZmlsZSBuYW1lIGluc3RlYWQgb2YgJ09wZW4gZmlsZScgaW4gZmxhc2hjYXJkIHJldmlldz9cIixcbiAgICBcIlJhbmRvbWl6ZSBjYXJkIG9yZGVyIGR1cmluZyByZXZpZXc/XCI6IFwiUmFuZG9taXplIGNhcmQgb3JkZXIgZHVyaW5nIHJldmlldz9cIixcbiAgICBcIkRpc2FibGUgY2xvemUgY2FyZHM/XCI6IFwiRGlzYWJsZSBjbG96ZSBjYXJkcz9cIixcbiAgICBcIklmIHlvdSdyZSBub3QgY3VycmVudGx5IHVzaW5nICdlbSAmIHdvdWxkIGxpa2UgdGhlIHBsdWdpbiB0byBydW4gYSB0YWQgZmFzdGVyLlwiOlxuICAgICAgICBcIklmIHlvdSdyZSBub3QgY3VycmVudGx5IHVzaW5nICdlbSAmIHdvdWxkIGxpa2UgdGhlIHBsdWdpbiB0byBydW4gYSB0YWQgZmFzdGVyLlwiLFxuICAgIFwiU2VwYXJhdG9yIGZvciBpbmxpbmUgZmxhc2hjYXJkc1wiOiBcIlNlcGFyYXRvciBmb3IgaW5saW5lIGZsYXNoY2FyZHNcIixcbiAgICBcIlNlcGFyYXRvciBmb3IgaW5saW5lIHJldmVyc2VkIGZsYXNoY2FyZHNcIjogXCJTZXBhcmF0b3IgZm9yIGlubGluZSByZXZlcnNlZCBmbGFzaGNhcmRzXCIsXG4gICAgXCJTZXBhcmF0b3IgZm9yIG11bHRpbGluZSByZXZlcnNlZCBmbGFzaGNhcmRzXCI6IFwiU2VwYXJhdG9yIGZvciBtdWx0aWxpbmUgcmV2ZXJzZWQgZmxhc2hjYXJkc1wiLFxuICAgIFwiTm90ZSB0aGF0IGFmdGVyIGNoYW5naW5nIHRoaXMgeW91IGhhdmUgdG8gbWFudWFsbHkgZWRpdCBhbnkgZmxhc2hjYXJkcyB5b3UgYWxyZWFkeSBoYXZlLlwiOlxuICAgICAgICBcIk5vdGUgdGhhdCBhZnRlciBjaGFuZ2luZyB0aGlzIHlvdSBoYXZlIHRvIG1hbnVhbGx5IGVkaXQgYW55IGZsYXNoY2FyZHMgeW91IGFscmVhZHkgaGF2ZS5cIixcbiAgICBcIlNlcGFyYXRvciBmb3IgbXVsdGlsaW5lIGZsYXNoY2FyZHNcIjogXCJTZXBhcmF0b3IgZm9yIG11bHRpbGluZSBmbGFzaGNhcmRzXCIsXG4gICAgXCJDbGVhciBjYWNoZT9cIjogXCJDbGVhciBjYWNoZT9cIixcbiAgICBcIkNsZWFyIGNhY2hlXCI6IFwiQ2xlYXIgY2FjaGVcIixcbiAgICBcIkNhY2hlIGNsZWFyZWRcIjogXCJDYWNoZSBjbGVhcmVkXCIsXG4gICAgXCJJZiB5b3UncmUgaGF2aW5nIGlzc3VlcyBzZWVpbmcgc29tZSBjYXJkcywgdHJ5IHRoaXMuXCI6XG4gICAgICAgIFwiSWYgeW91J3JlIGhhdmluZyBpc3N1ZXMgc2VlaW5nIHNvbWUgY2FyZHMsIHRyeSB0aGlzLlwiLFxuICAgIFwiVGFncyB0byByZXZpZXdcIjogXCJUYWdzIHRvIHJldmlld1wiLFxuICAgIFwiRW50ZXIgdGFncyBzZXBhcmF0ZWQgYnkgc3BhY2VzIG9yIG5ld2xpbmVzIGkuZS4gI3JldmlldyAjdGFnMiAjdGFnMy5cIjpcbiAgICAgICAgXCJFbnRlciB0YWdzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgbmV3bGluZXMgaS5lLiAjcmV2aWV3ICN0YWcyICN0YWczLlwiLFxuICAgIFwiT3BlbiBhIHJhbmRvbSBub3RlIGZvciByZXZpZXdcIjogXCJPcGVuIGEgcmFuZG9tIG5vdGUgZm9yIHJldmlld1wiLFxuICAgIFwiV2hlbiB5b3UgdHVybiB0aGlzIG9mZiwgbm90ZXMgYXJlIG9yZGVyZWQgYnkgaW1wb3J0YW5jZSAoUGFnZVJhbmspLlwiOlxuICAgICAgICBcIldoZW4geW91IHR1cm4gdGhpcyBvZmYsIG5vdGVzIGFyZSBvcmRlcmVkIGJ5IGltcG9ydGFuY2UgKFBhZ2VSYW5rKS5cIixcbiAgICBcIk9wZW4gbmV4dCBub3RlIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgYSByZXZpZXdcIjogXCJPcGVuIG5leHQgbm90ZSBhdXRvbWF0aWNhbGx5IGFmdGVyIGEgcmV2aWV3XCIsXG4gICAgXCJGb3IgZmFzdGVyIHJldmlld3MuXCI6IFwiRm9yIGZhc3RlciByZXZpZXdzLlwiLFxuICAgIFwiRGlzYWJsZSByZXZpZXcgb3B0aW9ucyBpbiB0aGUgZmlsZSBtZW51IGkuZS4gUmV2aWV3OiBFYXN5IEdvb2QgSGFyZFwiOlxuICAgICAgICBcIkRpc2FibGUgcmV2aWV3IG9wdGlvbnMgaW4gdGhlIGZpbGUgbWVudSBpLmUuIFJldmlldzogRWFzeSBHb29kIEhhcmRcIixcbiAgICBcIkFmdGVyIGRpc2FibGluZywgeW91IGNhbiByZXZpZXcgdXNpbmcgdGhlIGNvbW1hbmQgaG90a2V5cy4gUmVsb2FkIE9ic2lkaWFuIGFmdGVyIGNoYW5naW5nIHRoaXMuXCI6XG4gICAgICAgIFwiQWZ0ZXIgZGlzYWJsaW5nLCB5b3UgY2FuIHJldmlldyB1c2luZyB0aGUgY29tbWFuZCBob3RrZXlzLiBSZWxvYWQgT2JzaWRpYW4gYWZ0ZXIgY2hhbmdpbmcgdGhpcy5cIixcbiAgICBcIk1heGltdW0gbnVtYmVyIG9mIGRheXMgdG8gZGlzcGxheSBvbiByaWdodCBwYW5lbFwiOlxuICAgICAgICBcIk1heGltdW0gbnVtYmVyIG9mIGRheXMgdG8gZGlzcGxheSBvbiByaWdodCBwYW5lbFwiLFxuICAgIFwiUmVkdWNlIHRoaXMgZm9yIGEgY2xlYW5lciBpbnRlcmZhY2UuXCI6IFwiUmVkdWNlIHRoaXMgZm9yIGEgY2xlYW5lciBpbnRlcmZhY2UuXCIsXG4gICAgXCJUaGUgbnVtYmVyIG9mIGRheXMgbXVzdCBiZSBhdCBsZWFzdCAxLlwiOiBcIlRoZSBudW1iZXIgb2YgZGF5cyBtdXN0IGJlIGF0IGxlYXN0IDEuXCIsXG4gICAgXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIjogXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIixcbiAgICBBbGdvcml0aG06IFwiQWxnb3JpdGhtXCIsXG4gICAgXCJCYXNlIGVhc2VcIjogXCJCYXNlIGVhc2VcIixcbiAgICBcIm1pbmltdW0gPSAxMzAsIHByZWZlcnJhYmx5IGFwcHJveGltYXRlbHkgMjUwLlwiOlxuICAgICAgICBcIm1pbmltdW0gPSAxMzAsIHByZWZlcnJhYmx5IGFwcHJveGltYXRlbHkgMjUwLlwiLFxuICAgIFwiVGhlIGJhc2UgZWFzZSBtdXN0IGJlIGF0IGxlYXN0IDEzMC5cIjogXCJUaGUgYmFzZSBlYXNlIG11c3QgYmUgYXQgbGVhc3QgMTMwLlwiLFxuICAgIFwiSW50ZXJ2YWwgY2hhbmdlIHdoZW4geW91IHJldmlldyBhIGZsYXNoY2FyZC9ub3RlIGFzIGhhcmRcIjpcbiAgICAgICAgXCJJbnRlcnZhbCBjaGFuZ2Ugd2hlbiB5b3UgcmV2aWV3IGEgZmxhc2hjYXJkL25vdGUgYXMgaGFyZFwiLFxuICAgIFwibmV3SW50ZXJ2YWwgPSBvbGRJbnRlcnZhbCAqIGludGVydmFsQ2hhbmdlIC8gMTAwLlwiOlxuICAgICAgICBcIm5ld0ludGVydmFsID0gb2xkSW50ZXJ2YWwgKiBpbnRlcnZhbENoYW5nZSAvIDEwMC5cIixcbiAgICBcIkVhc3kgYm9udXNcIjogXCJFYXN5IGJvbnVzXCIsXG4gICAgXCJUaGUgZWFzeSBib251cyBhbGxvd3MgeW91IHRvIHNldCB0aGUgZGlmZmVyZW5jZSBpbiBpbnRlcnZhbHMgYmV0d2VlbiBhbnN3ZXJpbmcgR29vZCBhbmQgRWFzeSBvbiBhIGZsYXNoY2FyZC9ub3RlIChtaW5pbXVtID0gMTAwJSkuXCI6XG4gICAgICAgIFwiVGhlIGVhc3kgYm9udXMgYWxsb3dzIHlvdSB0byBzZXQgdGhlIGRpZmZlcmVuY2UgaW4gaW50ZXJ2YWxzIGJldHdlZW4gYW5zd2VyaW5nIEdvb2QgYW5kIEVhc3kgb24gYSBmbGFzaGNhcmQvbm90ZSAobWluaW11bSA9IDEwMCUpLlwiLFxuICAgIFwiVGhlIGVhc3kgYm9udXMgbXVzdCBiZSBhdCBsZWFzdCAxMDAuXCI6IFwiVGhlIGVhc3kgYm9udXMgbXVzdCBiZSBhdCBsZWFzdCAxMDAuXCIsXG4gICAgXCJNYXhpbXVtIEludGVydmFsXCI6IFwiTWF4aW11bSBJbnRlcnZhbFwiLFxuICAgIFwiQWxsb3dzIHlvdSB0byBwbGFjZSBhbiB1cHBlciBsaW1pdCBvbiB0aGUgaW50ZXJ2YWwgKGRlZmF1bHQgPSAxMDAgeWVhcnMpLlwiOlxuICAgICAgICBcIkFsbG93cyB5b3UgdG8gcGxhY2UgYW4gdXBwZXIgbGltaXQgb24gdGhlIGludGVydmFsIChkZWZhdWx0ID0gMTAwIHllYXJzKS5cIixcbiAgICBcIlRoZSBtYXhpbXVtIGludGVydmFsIG11c3QgYmUgYXQgbGVhc3QgMSBkYXkuXCI6IFwiVGhlIG1heGltdW0gaW50ZXJ2YWwgbXVzdCBiZSBhdCBsZWFzdCAxIGRheS5cIixcbiAgICBcIk1heGltdW0gbGluayBjb250cmlidXRpb25cIjogXCJNYXhpbXVtIGxpbmsgY29udHJpYnV0aW9uXCIsXG4gICAgXCJNYXhpbXVtIGNvbnRyaWJ1dGlvbiBvZiB0aGUgd2VpZ2h0ZWQgZWFzZSBvZiBsaW5rZWQgbm90ZXMgdG8gdGhlIGluaXRpYWwgZWFzZS5cIjpcbiAgICAgICAgXCJNYXhpbXVtIGNvbnRyaWJ1dGlvbiBvZiB0aGUgd2VpZ2h0ZWQgZWFzZSBvZiBsaW5rZWQgbm90ZXMgdG8gdGhlIGluaXRpYWwgZWFzZS5cIixcblxuICAgIC8vIHNpZGViYXIudHNcbiAgICBOZXc6IFwiTmV3XCIsXG4gICAgWWVzdGVyZGF5OiBcIlllc3RlcmRheVwiLFxuICAgIFRvZGF5OiBcIlRvZGF5XCIsXG4gICAgVG9tb3Jyb3c6IFwiVG9tb3Jyb3dcIixcbiAgICBcIk5vdGVzIFJldmlldyBRdWV1ZVwiOiBcIk5vdGVzIFJldmlldyBRdWV1ZVwiLFxuICAgIENsb3NlOiBcIkNsb3NlXCIsXG5cbiAgICAvLyBzdGF0cy1tb2RhbC50c1xuICAgIFN0YXRpc3RpY3M6IFwiU3RhdGlzdGljc1wiLFxuICAgIFwiTm90ZSB0aGF0IHRoaXMgcmVxdWlyZXMgdGhlIE9ic2lkaWFuIENoYXJ0cyBwbHVnaW4gdG8gd29ya1wiOlxuICAgICAgICBcIk5vdGUgdGhhdCB0aGlzIHJlcXVpcmVzIHRoZSBPYnNpZGlhbiBDaGFydHMgcGx1Z2luIHRvIHdvcmtcIixcbiAgICBGb3JlY2FzdDogXCJGb3JlY2FzdFwiLFxuICAgIFwiVGhlIG51bWJlciBvZiBjYXJkcyBkdWUgaW4gdGhlIGZ1dHVyZVwiOiBcIlRoZSBudW1iZXIgb2YgY2FyZHMgZHVlIGluIHRoZSBmdXR1cmVcIixcbiAgICBcIk51bWJlciBvZiBjYXJkc1wiOiBcIk51bWJlciBvZiBjYXJkc1wiLFxuICAgIFNjaGVkdWxlZDogXCJTY2hlZHVsZWRcIixcbiAgICBSZXZpZXc6IFwiUmV2aWV3XCIsXG4gICAgZHVlOiBcImR1ZVwiLFxuICAgIERheXM6IFwiRGF5c1wiLFxuICAgIFwiRm9sZGVycyB0byBpZ25vcmVcIjogXCJGb2xkZXJzIHRvIGlnbm9yZVwiLFxuICAgIFwiRW50ZXIgZm9sZGVyIHBhdGhzIHNlcGFyYXRlZCBieSBuZXdsaW5lcyBpLmUuIFRlbXBsYXRlcyBNZXRhL1NjcmlwdHNcIjpcbiAgICAgICAgXCJFbnRlciBmb2xkZXIgcGF0aHMgc2VwYXJhdGVkIGJ5IG5ld2xpbmVzIGkuZS4gVGVtcGxhdGVzIE1ldGEvU2NyaXB0c1wiLFxuICAgIFwiTm90ZSBpcyBzYXZlZCB1bmRlciBpZ25vcmVkIGZvbGRlciAoY2hlY2sgc2V0dGluZ3MpLlwiOlxuICAgICAgICBcIk5vdGUgaXMgc2F2ZWQgdW5kZXIgaWdub3JlZCBmb2xkZXIgKGNoZWNrIHNldHRpbmdzKS5cIixcbn07XG4iLCIvLyBCcml0aXNoIEVuZ2xpc2hcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBFc3Bhw7FvbFxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIGZyYW7Dp2Fpc1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIOCkueCkv+CkqOCljeCkpuClgFxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIEJhaGFzYSBJbmRvbmVzaWFcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBJdGFsaWFub1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIOaXpeacrOiqnlxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIO2VnOq1reyWtFxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIE5lZGVybGFuZHNcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBOb3Jza1xuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIGrEmXp5ayBwb2xza2lcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyBQb3J0dWd1w6pzXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gUG9ydHVndcOqcyBkbyBCcmFzaWxcbi8vIEJyYXppbGlhbiBQb3J0dWd1ZXNlXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gUm9tw6JuxINcblxuZXhwb3J0IGRlZmF1bHQge307XG4iLCIvLyDRgNGD0YHRgdC60LjQuVxuXG5leHBvcnQgZGVmYXVsdCB7fTtcbiIsIi8vIFTDvHJrw6dlXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g566A5L2T5Lit5paHXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8g57mB6auU5Lit5paHXG5cbmV4cG9ydCBkZWZhdWx0IHt9O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL21nbWV5ZXJzL29ic2lkaWFuLWthbmJhbi9ibG9iLzkzMDE0YzI1MTI1MDdmZGU5ZWFmZDI0MWU4ZDQzNjhhOGRmZGY4NTMvc3JjL2xhbmcvaGVscGVycy50c1xuXG5pbXBvcnQgeyBtb21lbnQgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCBhciBmcm9tIFwiLi9sb2NhbGUvYXJcIjtcbmltcG9ydCBjeiBmcm9tIFwiLi9sb2NhbGUvY3pcIjtcbmltcG9ydCBkYSBmcm9tIFwiLi9sb2NhbGUvZGFcIjtcbmltcG9ydCBkZSBmcm9tIFwiLi9sb2NhbGUvZGVcIjtcbmltcG9ydCBlbiBmcm9tIFwiLi9sb2NhbGUvZW5cIjtcbmltcG9ydCBlbkdCIGZyb20gXCIuL2xvY2FsZS9lbi1nYlwiO1xuaW1wb3J0IGVzIGZyb20gXCIuL2xvY2FsZS9lc1wiO1xuaW1wb3J0IGZyIGZyb20gXCIuL2xvY2FsZS9mclwiO1xuaW1wb3J0IGhpIGZyb20gXCIuL2xvY2FsZS9oaVwiO1xuaW1wb3J0IGlkIGZyb20gXCIuL2xvY2FsZS9pZFwiO1xuaW1wb3J0IGl0IGZyb20gXCIuL2xvY2FsZS9pdFwiO1xuaW1wb3J0IGphIGZyb20gXCIuL2xvY2FsZS9qYVwiO1xuaW1wb3J0IGtvIGZyb20gXCIuL2xvY2FsZS9rb1wiO1xuaW1wb3J0IG5sIGZyb20gXCIuL2xvY2FsZS9ubFwiO1xuaW1wb3J0IG5vIGZyb20gXCIuL2xvY2FsZS9ub1wiO1xuaW1wb3J0IHBsIGZyb20gXCIuL2xvY2FsZS9wbFwiO1xuaW1wb3J0IHB0IGZyb20gXCIuL2xvY2FsZS9wdFwiO1xuaW1wb3J0IHB0QlIgZnJvbSBcIi4vbG9jYWxlL3B0LWJyXCI7XG5pbXBvcnQgcm8gZnJvbSBcIi4vbG9jYWxlL3JvXCI7XG5pbXBvcnQgcnUgZnJvbSBcIi4vbG9jYWxlL3J1XCI7XG5pbXBvcnQgdHIgZnJvbSBcIi4vbG9jYWxlL3RyXCI7XG5pbXBvcnQgemhDTiBmcm9tIFwiLi9sb2NhbGUvemgtY25cIjtcbmltcG9ydCB6aFRXIGZyb20gXCIuL2xvY2FsZS96aC10d1wiO1xuXG5jb25zdCBsb2NhbGVNYXA6IHsgW2s6IHN0cmluZ106IFBhcnRpYWw8dHlwZW9mIGVuPiB9ID0ge1xuICAgIGFyLFxuICAgIGNzOiBjeixcbiAgICBkYSxcbiAgICBkZSxcbiAgICBlbixcbiAgICBcImVuLWdiXCI6IGVuR0IsXG4gICAgZXMsXG4gICAgZnIsXG4gICAgaGksXG4gICAgaWQsXG4gICAgaXQsXG4gICAgamEsXG4gICAga28sXG4gICAgbmwsXG4gICAgbm46IG5vLFxuICAgIHBsLFxuICAgIHB0LFxuICAgIFwicHQtYnJcIjogcHRCUixcbiAgICBybyxcbiAgICBydSxcbiAgICB0cixcbiAgICBcInpoLWNuXCI6IHpoQ04sXG4gICAgXCJ6aC10d1wiOiB6aFRXLFxufTtcblxuY29uc3QgbG9jYWxlID0gbG9jYWxlTWFwW21vbWVudC5sb2NhbGUoKV07XG5cbmV4cG9ydCBmdW5jdGlvbiB0KHN0cjoga2V5b2YgdHlwZW9mIGVuKTogc3RyaW5nIHtcbiAgICBpZiAoIWxvY2FsZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6IFNSUyBsb2NhbGUgbm90IGZvdW5kXCIsIG1vbWVudC5sb2NhbGUoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChsb2NhbGUgJiYgbG9jYWxlW3N0cl0pIHx8IGVuW3N0cl07XG59XG4iLCJpbXBvcnQgeyBOb3RpY2UsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIEFwcCwgUGxhdGZvcm0gfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHR5cGUgU1JQbHVnaW4gZnJvbSBcInNyYy9tYWluXCI7XG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCJzcmMvbG9nZ2VyXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcInNyYy9sYW5nL2hlbHBlcnNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTUlNldHRpbmdzIHtcbiAgICAvLyBmbGFzaGNhcmRzXG4gICAgZmxhc2hjYXJkVGFnczogc3RyaW5nW107XG4gICAgY29udmVydEZvbGRlcnNUb0RlY2tzOiBib29sZWFuO1xuICAgIGNhcmRDb21tZW50T25TYW1lTGluZTogYm9vbGVhbjtcbiAgICBidXJ5U2libGluZ0NhcmRzOiBib29sZWFuO1xuICAgIHNob3dDb250ZXh0SW5DYXJkczogYm9vbGVhbjtcbiAgICBmbGFzaGNhcmRIZWlnaHRQZXJjZW50YWdlOiBudW1iZXI7XG4gICAgZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlOiBudW1iZXI7XG4gICAgc2hvd0ZpbGVOYW1lSW5GaWxlTGluazogYm9vbGVhbjtcbiAgICByYW5kb21pemVDYXJkT3JkZXI6IGJvb2xlYW47XG4gICAgZGlzYWJsZUNsb3plQ2FyZHM6IGJvb2xlYW47XG4gICAgc2luZ2xlbGluZUNhcmRTZXBhcmF0b3I6IHN0cmluZztcbiAgICBzaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yOiBzdHJpbmc7XG4gICAgbXVsdGlsaW5lQ2FyZFNlcGFyYXRvcjogc3RyaW5nO1xuICAgIG11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjogc3RyaW5nO1xuICAgIC8vIG5vdGVzXG4gICAgdGFnc1RvUmV2aWV3OiBzdHJpbmdbXTtcbiAgICBub3RlRm9sZGVyc1RvSWdub3JlOiBzdHJpbmdbXTtcbiAgICBvcGVuUmFuZG9tTm90ZTogYm9vbGVhbjtcbiAgICBhdXRvTmV4dE5vdGU6IGJvb2xlYW47XG4gICAgZGlzYWJsZUZpbGVNZW51UmV2aWV3T3B0aW9uczogYm9vbGVhbjtcbiAgICBtYXhORGF5c05vdGVzUmV2aWV3UXVldWU6IG51bWJlcjtcbiAgICAvLyBhbGdvcml0aG1cbiAgICBiYXNlRWFzZTogbnVtYmVyO1xuICAgIGxhcHNlc0ludGVydmFsQ2hhbmdlOiBudW1iZXI7XG4gICAgZWFzeUJvbnVzOiBudW1iZXI7XG4gICAgbWF4aW11bUludGVydmFsOiBudW1iZXI7XG4gICAgbWF4TGlua0ZhY3RvcjogbnVtYmVyO1xuICAgIC8vIGxvZ2dpbmdcbiAgICBsb2dMZXZlbDogTG9nTGV2ZWw7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTUlNldHRpbmdzID0ge1xuICAgIC8vIGZsYXNoY2FyZHNcbiAgICBmbGFzaGNhcmRUYWdzOiBbXCIjZmxhc2hjYXJkc1wiXSxcbiAgICBjb252ZXJ0Rm9sZGVyc1RvRGVja3M6IGZhbHNlLFxuICAgIGNhcmRDb21tZW50T25TYW1lTGluZTogZmFsc2UsXG4gICAgYnVyeVNpYmxpbmdDYXJkczogZmFsc2UsXG4gICAgc2hvd0NvbnRleHRJbkNhcmRzOiB0cnVlLFxuICAgIGZsYXNoY2FyZEhlaWdodFBlcmNlbnRhZ2U6IFBsYXRmb3JtLmlzTW9iaWxlID8gMTAwIDogODAsXG4gICAgZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlOiBQbGF0Zm9ybS5pc01vYmlsZSA/IDEwMCA6IDQwLFxuICAgIHNob3dGaWxlTmFtZUluRmlsZUxpbms6IGZhbHNlLFxuICAgIHJhbmRvbWl6ZUNhcmRPcmRlcjogdHJ1ZSxcbiAgICBkaXNhYmxlQ2xvemVDYXJkczogZmFsc2UsXG4gICAgc2luZ2xlbGluZUNhcmRTZXBhcmF0b3I6IFwiOjpcIixcbiAgICBzaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yOiBcIjo6OlwiLFxuICAgIG11bHRpbGluZUNhcmRTZXBhcmF0b3I6IFwiP1wiLFxuICAgIG11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjogXCI/P1wiLFxuICAgIC8vIG5vdGVzXG4gICAgdGFnc1RvUmV2aWV3OiBbXCIjcmV2aWV3XCJdLFxuICAgIG5vdGVGb2xkZXJzVG9JZ25vcmU6IFtdLFxuICAgIG9wZW5SYW5kb21Ob3RlOiBmYWxzZSxcbiAgICBhdXRvTmV4dE5vdGU6IGZhbHNlLFxuICAgIGRpc2FibGVGaWxlTWVudVJldmlld09wdGlvbnM6IGZhbHNlLFxuICAgIG1heE5EYXlzTm90ZXNSZXZpZXdRdWV1ZTogMzY1LFxuICAgIC8vIGFsZ29yaXRobVxuICAgIGJhc2VFYXNlOiAyNTAsXG4gICAgbGFwc2VzSW50ZXJ2YWxDaGFuZ2U6IDAuNSxcbiAgICBlYXN5Qm9udXM6IDEuMyxcbiAgICBtYXhpbXVtSW50ZXJ2YWw6IDM2NTI1LFxuICAgIG1heExpbmtGYWN0b3I6IDEuMCxcbiAgICAvLyBsb2dnaW5nXG4gICAgbG9nTGV2ZWw6IExvZ0xldmVsLldhcm4sXG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWdtZXllcnMvb2JzaWRpYW4ta2FuYmFuL2Jsb2IvbWFpbi9zcmMvU2V0dGluZ3MudHNcbmxldCBhcHBseURlYm91bmNlVGltZXI6IG51bWJlciA9IDA7XG5mdW5jdGlvbiBhcHBseVNldHRpbmdzVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dChhcHBseURlYm91bmNlVGltZXIpO1xuICAgIGFwcGx5RGVib3VuY2VUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCA1MTIpO1xufVxuXG5leHBvcnQgY2xhc3MgU1JTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICAgcHJpdmF0ZSBwbHVnaW46IFNSUGx1Z2luO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogU1JQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB9XG5cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdigpLmlubmVySFRNTCA9XG4gICAgICAgICAgICBcIjxoMj5cIiArIHQoXCJTcGFjZWQgUmVwZXRpdGlvbiBQbHVnaW4gLSBTZXR0aW5nc1wiKSArIFwiPC9oMj5cIjtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoKS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgdChcIkZvciBtb3JlIGluZm9ybWF0aW9uLCBjaGVjayB0aGVcIikgK1xuICAgICAgICAgICAgJyA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL3N0M3Yzbm13L29ic2lkaWFuLXNwYWNlZC1yZXBldGl0aW9uL3dpa2lcIj4nICtcbiAgICAgICAgICAgIHQoXCJ3aWtpXCIpICtcbiAgICAgICAgICAgIFwiPC9hPi5cIjtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJGb2xkZXJzIHRvIGlnbm9yZVwiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKHQoXCJFbnRlciBmb2xkZXIgcGF0aHMgc2VwYXJhdGVkIGJ5IG5ld2xpbmVzIGkuZS4gVGVtcGxhdGVzIE1ldGEvU2NyaXB0c1wiKSlcbiAgICAgICAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm5vdGVGb2xkZXJzVG9JZ25vcmUuam9pbihcIlxcblwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5ub3RlRm9sZGVyc1RvSWdub3JlID0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KC9cXG4rLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgodikgPT4gdi50cmltKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHYpID0+IHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KCkuaW5uZXJIVE1MID0gXCI8aDM+XCIgKyB0KFwiRmxhc2hjYXJkc1wiKSArIFwiPC9oMz5cIjtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJGbGFzaGNhcmQgdGFnc1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXCJFbnRlciB0YWdzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgbmV3bGluZXMgaS5lLiAjZmxhc2hjYXJkcyAjZGVjazIgI2RlY2szLlwiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHRBcmVhKCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkVGFncy5qb2luKFwiIFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRUYWdzID0gdmFsdWUuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkNvbnZlcnQgZm9sZGVycyB0byBkZWNrcyBhbmQgc3ViZGVja3M/XCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcIlRoaXMgaXMgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIEZsYXNoY2FyZCB0YWdzIG9wdGlvbiBhYm92ZS5cIikpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmNvbnZlcnRGb2xkZXJzVG9EZWNrcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5jb252ZXJ0Rm9sZGVyc1RvRGVja3MgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIlNhdmUgc2NoZWR1bGluZyBjb21tZW50IG9uIHRoZSBzYW1lIGxpbmUgYXMgdGhlIGZsYXNoY2FyZCdzIGxhc3QgbGluZT9cIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwiVHVybmluZyB0aGlzIG9uIHdpbGwgbWFrZSB0aGUgSFRNTCBjb21tZW50cyBub3QgYnJlYWsgbGlzdCBmb3JtYXR0aW5nLlwiKSlcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuY2FyZENvbW1lbnRPblNhbWVMaW5lKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmNhcmRDb21tZW50T25TYW1lTGluZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiQnVyeSBzaWJsaW5nIGNhcmRzIHVudGlsIHRoZSBuZXh0IGRheT9cIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwiU2libGluZ3MgYXJlIGNhcmRzIGdlbmVyYXRlZCBmcm9tIHRoZSBzYW1lIGNhcmQgdGV4dCBpLmUuIGNsb3plIGRlbGV0aW9uc1wiKSlcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYnVyeVNpYmxpbmdDYXJkcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5idXJ5U2libGluZ0NhcmRzID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJTaG93IGNvbnRleHQgaW4gY2FyZHM/XCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcImkuZS4gVGl0bGUgPiBIZWFkaW5nIDEgPiBTdWJoZWFkaW5nID4gLi4uID4gU3ViaGVhZGluZ1wiKSlcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2hvd0NvbnRleHRJbkNhcmRzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNob3dDb250ZXh0SW5DYXJkcyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiRmxhc2hjYXJkIEhlaWdodCBQZXJjZW50YWdlXCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcIlNob3VsZCBiZSBzZXQgdG8gMTAwJSBvbiBtb2JpbGUgb3IgaWYgeW91IGhhdmUgdmVyeSBsYXJnZSBpbWFnZXNcIikpXG4gICAgICAgICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+XG4gICAgICAgICAgICAgICAgc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMTAsIDEwMCwgNSlcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkSGVpZ2h0UGVyY2VudGFnZSlcbiAgICAgICAgICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRIZWlnaHRQZXJjZW50YWdlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRIZWlnaHRQZXJjZW50YWdlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX1NFVFRJTkdTLmZsYXNoY2FyZEhlaWdodFBlcmNlbnRhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiRmxhc2hjYXJkIFdpZHRoIFBlcmNlbnRhZ2VcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwiU2hvdWxkIGJlIHNldCB0byAxMDAlIG9uIG1vYmlsZSBvciBpZiB5b3UgaGF2ZSB2ZXJ5IGxhcmdlIGltYWdlc1wiKSlcbiAgICAgICAgICAgIC5hZGRTbGlkZXIoKHNsaWRlcikgPT5cbiAgICAgICAgICAgICAgICBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgLnNldExpbWl0cygxMCwgMTAwLCA1KVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRXaWR0aFBlcmNlbnRhZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRXaWR0aFBlcmNlbnRhZ2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MuZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIlNob3cgZmlsZSBuYW1lIGluc3RlYWQgb2YgJ09wZW4gZmlsZScgaW4gZmxhc2hjYXJkIHJldmlldz9cIikpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNob3dGaWxlTmFtZUluRmlsZUxpbmspXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2hvd0ZpbGVOYW1lSW5GaWxlTGluayA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiUmFuZG9taXplIGNhcmQgb3JkZXIgZHVyaW5nIHJldmlldz9cIikpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnJhbmRvbWl6ZUNhcmRPcmRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5yYW5kb21pemVDYXJkT3JkZXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkRpc2FibGUgY2xvemUgY2FyZHM/XCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcIklmIHlvdSdyZSBub3QgY3VycmVudGx5IHVzaW5nICdlbSAmIHdvdWxkIGxpa2UgdGhlIHBsdWdpbiB0byBydW4gYSB0YWQgZmFzdGVyLlwiKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PlxuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5kaXNhYmxlQ2xvemVDYXJkcylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5kaXNhYmxlQ2xvemVDYXJkcyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiU2VwYXJhdG9yIGZvciBpbmxpbmUgZmxhc2hjYXJkc1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiTm90ZSB0aGF0IGFmdGVyIGNoYW5naW5nIHRoaXMgeW91IGhhdmUgdG8gbWFudWFsbHkgZWRpdCBhbnkgZmxhc2hjYXJkcyB5b3UgYWxyZWFkeSBoYXZlLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lQ2FyZFNlcGFyYXRvcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lQ2FyZFNlcGFyYXRvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZUNhcmRTZXBhcmF0b3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1Muc2luZ2xlbGluZUNhcmRTZXBhcmF0b3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiU2VwYXJhdG9yIGZvciBpbmxpbmUgcmV2ZXJzZWQgZmxhc2hjYXJkc1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKFxuICAgICAgICAgICAgICAgIHQoXG4gICAgICAgICAgICAgICAgICAgIFwiTm90ZSB0aGF0IGFmdGVyIGNoYW5naW5nIHRoaXMgeW91IGhhdmUgdG8gbWFudWFsbHkgZWRpdCBhbnkgZmxhc2hjYXJkcyB5b3UgYWxyZWFkeSBoYXZlLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZFRleHQoKHRleHQpID0+XG4gICAgICAgICAgICAgICAgdGV4dFxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHQoXCJSZXNldCB0byBkZWZhdWx0XCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1Muc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJTZXBhcmF0b3IgZm9yIG11bHRpbGluZSBmbGFzaGNhcmRzXCIpKVxuICAgICAgICAgICAgLnNldERlc2MoXG4gICAgICAgICAgICAgICAgdChcbiAgICAgICAgICAgICAgICAgICAgXCJOb3RlIHRoYXQgYWZ0ZXIgY2hhbmdpbmcgdGhpcyB5b3UgaGF2ZSB0byBtYW51YWxseSBlZGl0IGFueSBmbGFzaGNhcmRzIHlvdSBhbHJlYWR5IGhhdmUuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm11bHRpbGluZUNhcmRTZXBhcmF0b3IpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lQ2FyZFNlcGFyYXRvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lQ2FyZFNlcGFyYXRvciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5tdWx0aWxpbmVDYXJkU2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIlNlcGFyYXRvciBmb3IgbXVsdGlsaW5lIHJldmVyc2VkIGZsYXNoY2FyZHNcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIk5vdGUgdGhhdCBhZnRlciBjaGFuZ2luZyB0aGlzIHlvdSBoYXZlIHRvIG1hbnVhbGx5IGVkaXQgYW55IGZsYXNoY2FyZHMgeW91IGFscmVhZHkgaGF2ZS5cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX1NFVFRJTkdTLm11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJDbGVhciBjYWNoZT9cIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwiSWYgeW91J3JlIGhhdmluZyBpc3N1ZXMgc2VlaW5nIHNvbWUgY2FyZHMsIHRyeSB0aGlzLlwiKSlcbiAgICAgICAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5zZXRCdXR0b25UZXh0KHQoXCJDbGVhciBjYWNoZVwiKSkub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuY2FjaGUgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0KFwiQ2FjaGUgY2xlYXJlZFwiKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXJFbC5jcmVhdGVEaXYoKS5pbm5lckhUTUwgPSBcIjxoMz5cIiArIHQoXCJOb3Rlc1wiKSArIFwiPC9oMz5cIjtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJUYWdzIHRvIHJldmlld1wiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKHQoXCJFbnRlciB0YWdzIHNlcGFyYXRlZCBieSBzcGFjZXMgb3IgbmV3bGluZXMgaS5lLiAjcmV2aWV3ICN0YWcyICN0YWczLlwiKSlcbiAgICAgICAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnRhZ3NUb1Jldmlldy5qb2luKFwiIFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy50YWdzVG9SZXZpZXcgPSB2YWx1ZS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiT3BlbiBhIHJhbmRvbSBub3RlIGZvciByZXZpZXdcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwiV2hlbiB5b3UgdHVybiB0aGlzIG9mZiwgbm90ZXMgYXJlIG9yZGVyZWQgYnkgaW1wb3J0YW5jZSAoUGFnZVJhbmspLlwiKSlcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Mub3BlblJhbmRvbU5vdGUpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3Mub3BlblJhbmRvbU5vdGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIk9wZW4gbmV4dCBub3RlIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgYSByZXZpZXdcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyh0KFwiRm9yIGZhc3RlciByZXZpZXdzLlwiKSlcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT5cbiAgICAgICAgICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5hdXRvTmV4dE5vdGUpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmF1dG9OZXh0Tm90ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkRpc2FibGUgcmV2aWV3IG9wdGlvbnMgaW4gdGhlIGZpbGUgbWVudSBpLmUuIFJldmlldzogRWFzeSBHb29kIEhhcmRcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIkFmdGVyIGRpc2FibGluZywgeW91IGNhbiByZXZpZXcgdXNpbmcgdGhlIGNvbW1hbmQgaG90a2V5cy4gUmVsb2FkIE9ic2lkaWFuIGFmdGVyIGNoYW5naW5nIHRoaXMuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmRpc2FibGVGaWxlTWVudVJldmlld09wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZGlzYWJsZUZpbGVNZW51UmV2aWV3T3B0aW9ucyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSh0KFwiTWF4aW11bSBudW1iZXIgb2YgZGF5cyB0byBkaXNwbGF5IG9uIHJpZ2h0IHBhbmVsXCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcIlJlZHVjZSB0aGlzIGZvciBhIGNsZWFuZXIgaW50ZXJmYWNlLlwiKSlcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TkRheXNOb3Rlc1Jldmlld1F1ZXVlLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBudW1WYWx1ZTogbnVtYmVyID0gTnVtYmVyLnBhcnNlSW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtVmFsdWUgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJUaGUgbnVtYmVyIG9mIGRheXMgbXVzdCBiZSBhdCBsZWFzdCAxLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TkRheXNOb3Rlc1Jldmlld1F1ZXVlLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heE5EYXlzTm90ZXNSZXZpZXdRdWV1ZSA9IG51bVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodChcIlBsZWFzZSBwcm92aWRlIGEgdmFsaWQgbnVtYmVyLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHQoXCJSZXNldCB0byBkZWZhdWx0XCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heE5EYXlzTm90ZXNSZXZpZXdRdWV1ZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREVGQVVMVF9TRVRUSU5HUy5tYXhORGF5c05vdGVzUmV2aWV3UXVldWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlUGx1Z2luRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRGl2KCkuaW5uZXJIVE1MID0gXCI8aDM+XCIgKyB0KFwiQWxnb3JpdGhtXCIpICsgXCI8L2gzPlwiO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZURpdigpLmlubmVySFRNTCA9XG4gICAgICAgICAgICB0KFwiRm9yIG1vcmUgaW5mb3JtYXRpb24sIGNoZWNrIHRoZVwiKSArXG4gICAgICAgICAgICAnIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vc3QzdjNubXcvb2JzaWRpYW4tc3BhY2VkLXJlcGV0aXRpb24vd2lraS9TcGFjZWQtUmVwZXRpdGlvbi1BbGdvcml0aG1cIj4nICtcbiAgICAgICAgICAgIHQoXCJhbGdvcml0aG0gaW1wbGVtZW50YXRpb25cIikgK1xuICAgICAgICAgICAgXCI8L2E+LlwiO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkJhc2UgZWFzZVwiKSlcbiAgICAgICAgICAgIC5zZXREZXNjKHQoXCJtaW5pbXVtID0gMTMwLCBwcmVmZXJyYWJseSBhcHByb3hpbWF0ZWx5IDI1MC5cIikpXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYmFzZUVhc2UudG9TdHJpbmcoKSkub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5U2V0dGluZ3NVcGRhdGUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bVZhbHVlOiBudW1iZXIgPSBOdW1iZXIucGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1WYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtVmFsdWUgPCAxMzApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0KFwiVGhlIGJhc2UgZWFzZSBtdXN0IGJlIGF0IGxlYXN0IDEzMC5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFZhbHVlKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYmFzZUVhc2UudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmJhc2VFYXNlID0gbnVtVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0KFwiUGxlYXNlIHByb3ZpZGUgYSB2YWxpZCBudW1iZXIuXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYmFzZUVhc2UgPSBERUZBVUxUX1NFVFRJTkdTLmJhc2VFYXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkludGVydmFsIGNoYW5nZSB3aGVuIHlvdSByZXZpZXcgYSBmbGFzaGNhcmQvbm90ZSBhcyBoYXJkXCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcIm5ld0ludGVydmFsID0gb2xkSW50ZXJ2YWwgKiBpbnRlcnZhbENoYW5nZSAvIDEwMC5cIikpXG4gICAgICAgICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+XG4gICAgICAgICAgICAgICAgc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMSwgOTksIDEpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmxhcHNlc0ludGVydmFsQ2hhbmdlICogMTAwKVxuICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubGFwc2VzSW50ZXJ2YWxDaGFuZ2UgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcInJlc2V0XCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHQoXCJSZXNldCB0byBkZWZhdWx0XCIpKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmxhcHNlc0ludGVydmFsQ2hhbmdlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBERUZBVUxUX1NFVFRJTkdTLmxhcHNlc0ludGVydmFsQ2hhbmdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIkVhc3kgYm9udXNcIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFxuICAgICAgICAgICAgICAgICAgICBcIlRoZSBlYXN5IGJvbnVzIGFsbG93cyB5b3UgdG8gc2V0IHRoZSBkaWZmZXJlbmNlIGluIGludGVydmFscyBiZXR3ZWVuIGFuc3dlcmluZyBHb29kIGFuZCBFYXN5IG9uIGEgZmxhc2hjYXJkL25vdGUgKG1pbmltdW0gPSAxMDAlKS5cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKCh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLmVhc3lCb251cyAqIDEwMCkudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlTZXR0aW5nc1VwZGF0ZShhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bVZhbHVlOiBudW1iZXIgPSBOdW1iZXIucGFyc2VJbnQodmFsdWUpIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4obnVtVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudW1WYWx1ZSA8IDEuMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0KFwiVGhlIGVhc3kgYm9udXMgbXVzdCBiZSBhdCBsZWFzdCAxMDAuXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZWFzeUJvbnVzICogMTAwKS50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5lYXN5Qm9udXMgPSBudW1WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5lYXN5Qm9udXMgPSBERUZBVUxUX1NFVFRJTkdTLmVhc3lCb251cztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKHQoXCJNYXhpbXVtIEludGVydmFsXCIpKVxuICAgICAgICAgICAgLnNldERlc2ModChcIkFsbG93cyB5b3UgdG8gcGxhY2UgYW4gdXBwZXIgbGltaXQgb24gdGhlIGludGVydmFsIChkZWZhdWx0ID0gMTAwIHllYXJzKS5cIikpXG4gICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT5cbiAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heGltdW1JbnRlcnZhbC50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBseVNldHRpbmdzVXBkYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbnVtVmFsdWU6IG51bWJlciA9IE51bWJlci5wYXJzZUludCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1WYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bVZhbHVlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0KFwiVGhlIG1heGltdW0gaW50ZXJ2YWwgbXVzdCBiZSBhdCBsZWFzdCAxIGRheS5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC5zZXRWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLm1heGltdW1JbnRlcnZhbC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhpbXVtSW50ZXJ2YWwgPSBudW1WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIG51bWJlci5cIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b24pID0+IHtcbiAgICAgICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJyZXNldFwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0KFwiUmVzZXQgdG8gZGVmYXVsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhpbXVtSW50ZXJ2YWwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MubWF4aW11bUludGVydmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUodChcIk1heGltdW0gbGluayBjb250cmlidXRpb25cIikpXG4gICAgICAgICAgICAuc2V0RGVzYyhcbiAgICAgICAgICAgICAgICB0KFwiTWF4aW11bSBjb250cmlidXRpb24gb2YgdGhlIHdlaWdodGVkIGVhc2Ugb2YgbGlua2VkIG5vdGVzIHRvIHRoZSBpbml0aWFsIGVhc2UuXCIpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkU2xpZGVyKChzbGlkZXIpID0+XG4gICAgICAgICAgICAgICAgc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMCwgMTAwLCAxKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhMaW5rRmFjdG9yICogMTAwKVxuICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TGlua0ZhY3RvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVBsdWdpbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKFwicmVzZXRcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodChcIlJlc2V0IHRvIGRlZmF1bHRcIikpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MubWF4TGlua0ZhY3RvciA9IERFRkFVTFRfU0VUVElOR1MubWF4TGlua0ZhY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBURmlsZSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBTUlNldHRpbmdzIH0gZnJvbSBcInNyYy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ2FyZFR5cGUgfSBmcm9tIFwic3JjL3R5cGVzXCI7XG5pbXBvcnQgeyB0IH0gZnJvbSBcInNyYy9sYW5nL2hlbHBlcnNcIjtcblxuZXhwb3J0IGVudW0gUmV2aWV3UmVzcG9uc2Uge1xuICAgIEVhc3ksXG4gICAgR29vZCxcbiAgICBIYXJkLFxuICAgIFJlc2V0LFxufVxuXG4vLyBGbGFzaGNhcmRzXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FyZCB7XG4gICAgLy8gc2NoZWR1bGluZ1xuICAgIGlzRHVlOiBib29sZWFuO1xuICAgIGludGVydmFsPzogbnVtYmVyO1xuICAgIGVhc2U/OiBudW1iZXI7XG4gICAgZGVsYXlCZWZvcmVSZXZpZXc/OiBudW1iZXI7XG4gICAgLy8gbm90ZVxuICAgIG5vdGU6IFRGaWxlO1xuICAgIGxpbmVObzogbnVtYmVyO1xuICAgIC8vIHZpc3VhbHNcbiAgICBmcm9udDogc3RyaW5nO1xuICAgIGJhY2s6IHN0cmluZztcbiAgICBjYXJkVGV4dDogc3RyaW5nO1xuICAgIGNvbnRleHQ6IHN0cmluZztcbiAgICAvLyB0eXBlc1xuICAgIGNhcmRUeXBlOiBDYXJkVHlwZTtcbiAgICAvLyBpbmZvcm1hdGlvbiBmb3Igc2libGluZyBjYXJkc1xuICAgIHNpYmxpbmdJZHg6IG51bWJlcjtcbiAgICBzaWJsaW5nczogQ2FyZFtdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGUoXG4gICAgcmVzcG9uc2U6IFJldmlld1Jlc3BvbnNlLFxuICAgIGludGVydmFsOiBudW1iZXIsXG4gICAgZWFzZTogbnVtYmVyLFxuICAgIGRlbGF5QmVmb3JlUmV2aWV3OiBudW1iZXIsXG4gICAgc2V0dGluZ3NPYmo6IFNSU2V0dGluZ3MsXG4gICAgZHVlRGF0ZXM/OiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+XG4pOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+IHtcbiAgICBkZWxheUJlZm9yZVJldmlldyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3IoZGVsYXlCZWZvcmVSZXZpZXcgLyAoMjQgKiAzNjAwICogMTAwMCkpKTtcblxuICAgIGlmIChyZXNwb25zZSA9PT0gUmV2aWV3UmVzcG9uc2UuRWFzeSkge1xuICAgICAgICBlYXNlICs9IDIwO1xuICAgICAgICBpbnRlcnZhbCA9ICgoaW50ZXJ2YWwgKyBkZWxheUJlZm9yZVJldmlldykgKiBlYXNlKSAvIDEwMDtcbiAgICAgICAgaW50ZXJ2YWwgKj0gc2V0dGluZ3NPYmouZWFzeUJvbnVzO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT09IFJldmlld1Jlc3BvbnNlLkdvb2QpIHtcbiAgICAgICAgaW50ZXJ2YWwgPSAoKGludGVydmFsICsgZGVsYXlCZWZvcmVSZXZpZXcgLyAyKSAqIGVhc2UpIC8gMTAwO1xuICAgIH0gZWxzZSBpZiAocmVzcG9uc2UgPT09IFJldmlld1Jlc3BvbnNlLkhhcmQpIHtcbiAgICAgICAgZWFzZSA9IE1hdGgubWF4KDEzMCwgZWFzZSAtIDIwKTtcbiAgICAgICAgaW50ZXJ2YWwgPSBNYXRoLm1heChcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAoaW50ZXJ2YWwgKyBkZWxheUJlZm9yZVJldmlldyAvIDQpICogc2V0dGluZ3NPYmoubGFwc2VzSW50ZXJ2YWxDaGFuZ2VcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyByZXBsYWNlcyByYW5kb20gZnV6eiB3aXRoIGxvYWQgYmFsYW5jaW5nIG92ZXIgdGhlIGZ1enogaW50ZXJ2YWxcbiAgICBpZiAoZHVlRGF0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpbnRlcnZhbCA9IE1hdGgucm91bmQoaW50ZXJ2YWwpO1xuICAgICAgICBpZiAoIWR1ZURhdGVzLmhhc093blByb3BlcnR5KGludGVydmFsKSkge1xuICAgICAgICAgICAgZHVlRGF0ZXNbaW50ZXJ2YWxdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmdXp6UmFuZ2U6IFtudW1iZXIsIG51bWJlcl07XG4gICAgICAgIC8vIGRpc2FibGUgZnV6emluZyBmb3Igc21hbGwgaW50ZXJ2YWxzXG4gICAgICAgIGlmIChpbnRlcnZhbCA8PSA0KSB7XG4gICAgICAgICAgICBmdXp6UmFuZ2UgPSBbaW50ZXJ2YWwsIGludGVydmFsXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmdXp6OiBudW1iZXI7XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWwgPCA3KSBmdXp6ID0gMTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGludGVydmFsIDwgMzApIGZ1enogPSBNYXRoLm1heCgyLCBNYXRoLmZsb29yKGludGVydmFsICogMC4xNSkpO1xuICAgICAgICAgICAgZWxzZSBmdXp6ID0gTWF0aC5tYXgoNCwgTWF0aC5mbG9vcihpbnRlcnZhbCAqIDAuMDUpKTtcbiAgICAgICAgICAgIGZ1enpSYW5nZSA9IFtpbnRlcnZhbCAtIGZ1enosIGludGVydmFsICsgZnV6el07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpdmwgPSBmdXp6UmFuZ2VbMF07IGl2bCA8PSBmdXp6UmFuZ2VbMV07IGl2bCsrKSB7XG4gICAgICAgICAgICBpZiAoIWR1ZURhdGVzLmhhc093blByb3BlcnR5KGl2bCkpIHtcbiAgICAgICAgICAgICAgICBkdWVEYXRlc1tpdmxdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkdWVEYXRlc1tpdmxdIDwgZHVlRGF0ZXNbaW50ZXJ2YWxdKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBpdmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkdWVEYXRlc1tpbnRlcnZhbF0rKztcbiAgICB9XG5cbiAgICBpbnRlcnZhbCA9IE1hdGgubWluKGludGVydmFsLCBzZXR0aW5nc09iai5tYXhpbXVtSW50ZXJ2YWwpO1xuXG4gICAgcmV0dXJuIHsgaW50ZXJ2YWw6IE1hdGgucm91bmQoaW50ZXJ2YWwgKiAxMCkgLyAxMCwgZWFzZSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGV4dEludGVydmFsKGludGVydmFsOiBudW1iZXIsIGlzTW9iaWxlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICBsZXQgbTogbnVtYmVyID0gTWF0aC5yb3VuZChpbnRlcnZhbCAvIDMpIC8gMTAsXG4gICAgICAgIHk6IG51bWJlciA9IE1hdGgucm91bmQoaW50ZXJ2YWwgLyAzNi41KSAvIDEwO1xuXG4gICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgIGlmIChpbnRlcnZhbCA8IDMwKSByZXR1cm4gYCR7aW50ZXJ2YWx9ZGA7XG4gICAgICAgIGVsc2UgaWYgKGludGVydmFsIDwgMzY1KSByZXR1cm4gYCR7bX1tYDtcbiAgICAgICAgZWxzZSByZXR1cm4gYCR7eX15YDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaW50ZXJ2YWwgPCAzMCkge1xuICAgICAgICAgICAgcmV0dXJuIGludGVydmFsID09PSAxLjAgPyBcIjEuMCBcIiArIHQoXCJkYXlcIikgOiBpbnRlcnZhbC50b1N0cmluZygpICsgXCIgXCIgKyB0KFwiZGF5c1wiKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnRlcnZhbCA8IDM2NSkge1xuICAgICAgICAgICAgcmV0dXJuIG0gPT09IDEuMCA/IFwiMS4wIFwiICsgdChcIm1vbnRoXCIpIDogbS50b1N0cmluZygpICsgXCIgXCIgKyB0KFwibW9udGhzXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHkgPT09IDEuMCA/IFwiMS4wIFwiICsgdChcInllYXJcIikgOiB5LnRvU3RyaW5nKCkgKyBcIiBcIiArIHQoXCJ5ZWFyc1wiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9vYnNpZGlhbm1kL29ic2lkaWFuLWFwaS9pc3N1ZXMvMTNcblxuLy8gZmxhc2hjYXJkc1xuXG5leHBvcnQgZW51bSBDYXJkVHlwZSB7XG4gICAgU2luZ2xlTGluZUJhc2ljLFxuICAgIFNpbmdsZUxpbmVSZXZlcnNlZCxcbiAgICBNdWx0aUxpbmVCYXNpYyxcbiAgICBNdWx0aUxpbmVSZXZlcnNlZCxcbiAgICBDbG96ZSxcbn1cbiIsImV4cG9ydCBjb25zdCBTQ0hFRFVMSU5HX0lORk9fUkVHRVg6IFJlZ0V4cCA9XG4gICAgL14tLS1cXG4oKD86LipcXG4pKilzci1kdWU6ICguKylcXG5zci1pbnRlcnZhbDogKFxcZCspXFxuc3ItZWFzZTogKFxcZCspXFxuKCg/Oi4qXFxuKSopLS0tLztcbmV4cG9ydCBjb25zdCBZQU1MX0ZST05UX01BVFRFUl9SRUdFWDogUmVnRXhwID0gL14tLS1cXG4oKD86LipcXG4pKj8pLS0tLztcblxuZXhwb3J0IGNvbnN0IE1VTFRJX1NDSEVEVUxJTkdfRVhUUkFDVE9SOiBSZWdFeHAgPSAvIShbXFxkLV0rKSwoXFxkKyksKFxcZCspL2dtO1xuZXhwb3J0IGNvbnN0IExFR0FDWV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUjogUmVnRXhwID0gLzwhLS1TUjooW1xcZC1dKyksKFxcZCspLChcXGQrKS0tPi9nbTtcblxuZXhwb3J0IGNvbnN0IENST1NTX0hBSVJTX0lDT046IHN0cmluZyA9IGA8cGF0aCBzdHlsZT1cIiBzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOmN1cnJlbnRDb2xvcjtmaWxsLW9wYWNpdHk6MTtcIiBkPVwiTSA5OS45MjE4NzUgNDcuOTQxNDA2IEwgOTMuMDc0MjE5IDQ3Ljk0MTQwNiBDIDkyLjg0Mzc1IDQyLjAzMTI1IDkxLjM5MDYyNSAzNi4yMzgyODEgODguODAwNzgxIDMwLjkyMTg3NSBMIDg1LjM2NzE4OCAzMi41ODIwMzEgQyA4Ny42Njc5NjkgMzcuMzU1NDY5IDg4Ljk2NDg0NCA0Mi41NTA3ODEgODkuMTgzNTk0IDQ3Ljg0Mzc1IEwgODIuMjM4MjgxIDQ3Ljg0Mzc1IEMgODIuMDk3NjU2IDQ0LjYxNzE4OCA4MS41ODk4NDQgNDEuNDE3OTY5IDgwLjczNDM3NSAzOC4zMDQ2ODggTCA3Ny4wNTA3ODEgMzkuMzM1OTM4IEMgNzcuODA4NTk0IDQyLjA4OTg0NCA3OC4yNjE3MTkgNDQuOTE3OTY5IDc4LjQwNjI1IDQ3Ljc2OTUzMSBMIDY1Ljg3MTA5NCA0Ny43Njk1MzEgQyA2NC45MTQwNjIgNDAuNTA3ODEyIDU5LjE0NDUzMSAzNC44MzIwMzEgNTEuODcxMDk0IDMzLjk5NjA5NCBMIDUxLjg3MTA5NCAyMS4zODY3MTkgQyA1NC44MTY0MDYgMjEuNTA3ODEyIDU3Ljc0MjE4OCAyMS45NjA5MzggNjAuNTg1OTM4IDIyLjczODI4MSBMIDYxLjYxNzE4OCAxOS4wNTg1OTQgQyA1OC40Mzc1IDE4LjE5MTQwNiA1NS4xNjQwNjIgMTcuNjkxNDA2IDUxLjg3MTA5NCAxNy41NzAzMTIgTCA1MS44NzEwOTQgMTAuNTUwNzgxIEMgNTcuMTY0MDYyIDEwLjc2OTUzMSA2Mi4zNTU0NjkgMTIuMDY2NDA2IDY3LjEzMjgxMiAxNC4zNjMyODEgTCA2OC43ODkwNjIgMTAuOTI5Njg4IEMgNjMuNSA4LjM4MjgxMiA1Ny43MzgyODEgNi45NTMxMjUgNTEuODcxMDk0IDYuNzM0Mzc1IEwgNTEuODcxMDk0IDAuMDM5MDYyNSBMIDQ4LjA1NDY4OCAwLjAzOTA2MjUgTCA0OC4wNTQ2ODggNi43MzQzNzUgQyA0Mi4xNzk2ODggNi45NzY1NjIgMzYuNDE3OTY5IDguNDMzNTk0IDMxLjEzMjgxMiAxMS4wMDc4MTIgTCAzMi43OTI5NjkgMTQuNDQxNDA2IEMgMzcuNTY2NDA2IDEyLjE0MDYyNSA0Mi43NjE3MTkgMTAuODQzNzUgNDguMDU0Njg4IDEwLjYyNSBMIDQ4LjA1NDY4OCAxNy41NzAzMTIgQyA0NC44MjgxMjUgMTcuNzE0ODQ0IDQxLjYyODkwNiAxOC4yMTg3NSAzOC41MTU2MjUgMTkuMDc4MTI1IEwgMzkuNTQ2ODc1IDIyLjc1NzgxMiBDIDQyLjMyNDIxOSAyMS45ODgyODEgNDUuMTc1NzgxIDIxLjUzMTI1IDQ4LjA1NDY4OCAyMS4zODY3MTkgTCA0OC4wNTQ2ODggMzQuMDMxMjUgQyA0MC43OTY4NzUgMzQuOTQ5MjE5IDM1LjA4OTg0NCA0MC42Nzk2ODggMzQuMjAzMTI1IDQ3Ljk0MTQwNiBMIDIxLjUgNDcuOTQxNDA2IEMgMjEuNjMyODEyIDQ1LjA0Mjk2OSAyMi4wODk4NDQgNDIuMTcxODc1IDIyLjg1NTQ2OSAzOS4zNzUgTCAxOS4xNzE4NzUgMzguMzQzNzUgQyAxOC4zMTI1IDQxLjQ1NzAzMSAxNy44MDg1OTQgNDQuNjU2MjUgMTcuNjY0MDYyIDQ3Ljg4MjgxMiBMIDEwLjY2NDA2MiA0Ny44ODI4MTIgQyAxMC44ODI4MTIgNDIuNTg5ODQ0IDEyLjE3OTY4OCAzNy4zOTQ1MzEgMTQuNDgwNDY5IDMyLjYyMTA5NCBMIDExLjEyMTA5NCAzMC45MjE4NzUgQyA4LjUzNTE1NiAzNi4yMzgyODEgNy4wNzgxMjUgNDIuMDMxMjUgNi44NDc2NTYgNDcuOTQxNDA2IEwgMCA0Ny45NDE0MDYgTCAwIDUxLjc1MzkwNiBMIDYuODQ3NjU2IDUxLjc1MzkwNiBDIDcuMDg5ODQ0IDU3LjYzNjcxOSA4LjU0Mjk2OSA2My40MDIzNDQgMTEuMTIxMDk0IDY4LjY5NTMxMiBMIDE0LjU1NDY4OCA2Ny4wMzUxNTYgQyAxMi4yNTc4MTIgNjIuMjYxNzE5IDEwLjk1NzAzMSA1Ny4wNjY0MDYgMTAuNzM4MjgxIDUxLjc3MzQzOCBMIDE3Ljc0MjE4OCA1MS43NzM0MzggQyAxNy44NTU0NjkgNTUuMDQyOTY5IDE4LjM0Mzc1IDU4LjI4OTA2MiAxOS4xOTE0MDYgNjEuNDQ1MzEyIEwgMjIuODcxMDk0IDYwLjQxNDA2MiBDIDIyLjA4OTg0NCA1Ny41NjI1IDIxLjYyODkwNiA1NC42MzI4MTIgMjEuNSA1MS42Nzk2ODggTCAzNC4yMDMxMjUgNTEuNjc5Njg4IEMgMzUuMDU4NTk0IDU4Ljk2ODc1IDQwLjc3MzQzOCA2NC43MzgyODEgNDguMDU0Njg4IDY1LjY2MDE1NiBMIDQ4LjA1NDY4OCA3OC4zMDg1OTQgQyA0NS4xMDU0NjkgNzguMTg3NSA0Mi4xODM1OTQgNzcuNzMwNDY5IDM5LjMzNTkzOCA3Ni45NTcwMzEgTCAzOC4zMDQ2ODggODAuNjM2NzE5IEMgNDEuNDg4MjgxIDgxLjUxMTcxOSA0NC43NTc4MTIgODIuMDE1NjI1IDQ4LjA1NDY4OCA4Mi4xNDQ1MzEgTCA0OC4wNTQ2ODggODkuMTQ0NTMxIEMgNDIuNzYxNzE5IDg4LjkyNTc4MSAzNy41NjY0MDYgODcuNjI4OTA2IDMyLjc5Mjk2OSA4NS4zMjgxMjUgTCAzMS4xMzI4MTIgODguNzY1NjI1IEMgMzYuNDI1NzgxIDkxLjMxMjUgNDIuMTgzNTk0IDkyLjc0MjE4OCA0OC4wNTQ2ODggOTIuOTYwOTM4IEwgNDguMDU0Njg4IDk5Ljk2MDkzOCBMIDUxLjg3MTA5NCA5OS45NjA5MzggTCA1MS44NzEwOTQgOTIuOTYwOTM4IEMgNTcuNzUgOTIuNzE4NzUgNjMuNTE5NTMxIDkxLjI2NTYyNSA2OC44MDg1OTQgODguNjg3NSBMIDY3LjEzMjgxMiA4NS4yNTM5MDYgQyA2Mi4zNTU0NjkgODcuNTUwNzgxIDU3LjE2NDA2MiA4OC44NTE1NjIgNTEuODcxMDk0IDg5LjA3MDMxMiBMIDUxLjg3MTA5NCA4Mi4xMjUgQyA1NS4wOTM3NSA4MS45ODA0NjkgNTguMjkyOTY5IDgxLjQ3NjU2MiA2MS40MDYyNSA4MC42MTcxODggTCA2MC4zNzg5MDYgNzYuOTM3NSBDIDU3LjU3NDIxOSA3Ny43MDMxMjUgNTQuNjk1MzEyIDc4LjE1NjI1IDUxLjc5Mjk2OSA3OC4yODkwNjIgTCA1MS43OTI5NjkgNjUuNjc5Njg4IEMgNTkuMTIxMDk0IDY0LjgyODEyNSA2NC45MTAxNTYgNTkuMDYyNSA2NS43OTY4NzUgNTEuNzM0Mzc1IEwgNzguMzY3MTg4IDUxLjczNDM3NSBDIDc4LjI1IDU0LjczNDM3NSA3Ny43ODkwNjIgNTcuNzEwOTM4IDc2Ljk5MjE4OCA2MC42MDU0NjkgTCA4MC42NzU3ODEgNjEuNjM2NzE5IEMgODEuNTU4NTk0IDU4LjQwNjI1IDgyLjA2NjQwNiA1NS4wODIwMzEgODIuMTgzNTk0IDUxLjczNDM3NSBMIDg5LjI2MTcxOSA1MS43MzQzNzUgQyA4OS4wNDI5NjkgNTcuMDMxMjUgODcuNzQyMTg4IDYyLjIyMjY1NiA4NS40NDUzMTIgNjYuOTk2MDk0IEwgODguODc4OTA2IDY4LjY1NjI1IEMgOTEuNDU3MDMxIDYzLjM2NzE4OCA5Mi45MTAxNTYgNTcuNTk3NjU2IDkzLjE1MjM0NCA1MS43MTg3NSBMIDEwMCA1MS43MTg3NSBaIE0gNjIuMDE5NTMxIDUxLjczNDM3NSBDIDYxLjE4MzU5NCA1Ni45NDUzMTIgNTcuMDg1OTM4IDYxLjAyMzQzOCA1MS44NzEwOTQgNjEuODI4MTI1IEwgNTEuODcxMDk0IDU3LjUxNTYyNSBMIDQ4LjA1NDY4OCA1Ny41MTU2MjUgTCA0OC4wNTQ2ODggNjEuODA4NTk0IEMgNDIuOTEwMTU2IDYwLjk0OTIxOSAzOC44ODY3MTkgNTYuOTAyMzQ0IDM4LjA1ODU5NCA1MS43NTM5MDYgTCA0Mi4zMzIwMzEgNTEuNzUzOTA2IEwgNDIuMzMyMDMxIDQ3Ljk0MTQwNiBMIDM4LjA1ODU5NCA0Ny45NDE0MDYgQyAzOC44ODY3MTkgNDIuNzg5MDYyIDQyLjkxMDE1NiAzOC43NDYwOTQgNDguMDU0Njg4IDM3Ljg4NjcxOSBMIDQ4LjA1NDY4OCA0Mi4xNzk2ODggTCA1MS44NzEwOTQgNDIuMTc5Njg4IEwgNTEuODcxMDk0IDM3Ljg0NzY1NiBDIDU3LjA3ODEyNSAzOC42NDg0MzggNjEuMTc5Njg4IDQyLjcxODc1IDYyLjAxOTUzMSA0Ny45MjE4NzUgTCA1Ny43MDcwMzEgNDcuOTIxODc1IEwgNTcuNzA3MDMxIDUxLjczNDM3NSBaIE0gNjIuMDE5NTMxIDUxLjczNDM3NSBcIi8+YDtcbmV4cG9ydCBjb25zdCBDT0xMQVBTRV9JQ09OOiBzdHJpbmcgPSBgPHN2ZyB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiB3aWR0aD1cIjhcIiBoZWlnaHQ9XCI4XCIgY2xhc3M9XCJyaWdodC10cmlhbmdsZVwiPjxwYXRoIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBkPVwiTTk0LjksMjAuOGMtMS40LTIuNS00LjEtNC4xLTcuMS00LjFIMTIuMmMtMywwLTUuNywxLjYtNy4xLDQuMWMtMS4zLDIuNC0xLjIsNS4yLDAuMiw3LjZMNDMuMSw4OGMxLjUsMi4zLDQsMy43LDYuOSwzLjcgczUuNC0xLjQsNi45LTMuN2wzNy44LTU5LjZDOTYuMSwyNiw5Ni4yLDIzLjIsOTQuOSwyMC44TDk0LjksMjAuOHpcIj48L3BhdGg+PC9zdmc+YDtcbiIsInR5cGUgSGV4ID0gbnVtYmVyO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGtleXMgb2YgYW4gb2JqZWN0IHdpdGggdHlwZSBgKGtleW9mIFQpW11gXG4gKiBpbnN0ZWFkIG9mIGBzdHJpbmdbXWBcbiAqIFBsZWFzZSBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU5NDU5MDAwIGZvciBtb3JlIGRldGFpbHNcbiAqXG4gKiBAcGFyYW0gb2JqIC0gQW4gb2JqZWN0XG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiB0aGUga2V5cyBvZiBgb2JqYCB3aXRoIHR5cGUgYChrZXlvZiBUKVtdYFxuICovXG5leHBvcnQgY29uc3QgZ2V0S2V5c1ByZXNlcnZlVHlwZSA9IE9iamVjdC5rZXlzIGFzIDxUIGV4dGVuZHMgb2JqZWN0PihvYmo6IFQpID0+IEFycmF5PGtleW9mIFQ+O1xuXG4vKipcbiAqIEVzY2FwZXMgdGhlIGlucHV0IHN0cmluZyBzbyB0aGF0IGl0IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSByZWdleFxuICogd2hpbGUgbWFraW5nIHN1cmUgdGhhdCBzeW1ib2xzIGxpa2UgYD9gIGFuZCBgKmAgYXJlbid0IGludGVycHJldGVkXG4gKiBhcyByZWdleCBzcGVjaWFscy5cbiAqIFBsZWFzZSBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY5Njk0ODYgZm9yIG1vcmUgZGV0YWlsc1xuICpcbiAqIEBwYXJhbSBzdHIgLSBUaGUgc3RyaW5nIHRvIGJlIGVzY2FwZWRcbiAqIEByZXR1cm5zIFRoZSBlc2NhcGVkIHN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgZXNjYXBlUmVnZXhTdHJpbmcgPSAodGV4dDogc3RyaW5nKSA9PiB0ZXh0LnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjeXJiNTMgaGFzaCAoaGV4IHN0cmluZykgb2YgdGhlIGlucHV0IHN0cmluZ1xuICogUGxlYXNlIHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTIxNzE0ODAgZm9yIG1vcmUgZGV0YWlsc1xuICpcbiAqIEBwYXJhbSBzdHIgLSBUaGUgc3RyaW5nIHRvIGJlIGhhc2hlZFxuICogQHBhcmFtIHNlZWQgLSBUaGUgc2VlZCBmb3IgdGhlIGN5cmI1MyBmdW5jdGlvblxuICogQHJldHVybnMgVGhlIGN5cmI1MyBoYXNoIChoZXggc3RyaW5nKSBvZiBgc3RyYCBzZWVkZWQgdXNpbmcgYHNlZWRgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjeXJiNTMoc3RyOiBzdHJpbmcsIHNlZWQ6IG51bWJlciA9IDApOiBzdHJpbmcge1xuICAgIGxldCBoMTogSGV4ID0gMHhkZWFkYmVlZiBeIHNlZWQsXG4gICAgICAgIGgyOiBIZXggPSAweDQxYzZjZTU3IF4gc2VlZDtcbiAgICBmb3IgKGxldCBpID0gMCwgY2g7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2ggPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaDEgPSBNYXRoLmltdWwoaDEgXiBjaCwgMjY1NDQzNTc2MSk7XG4gICAgICAgIGgyID0gTWF0aC5pbXVsKGgyIF4gY2gsIDE1OTczMzQ2NzcpO1xuICAgIH1cbiAgICBoMSA9IE1hdGguaW11bChoMSBeIChoMSA+Pj4gMTYpLCAyMjQ2ODIyNTA3KSBeIE1hdGguaW11bChoMiBeIChoMiA+Pj4gMTMpLCAzMjY2NDg5OTA5KTtcbiAgICBoMiA9IE1hdGguaW11bChoMiBeIChoMiA+Pj4gMTYpLCAyMjQ2ODIyNTA3KSBeIE1hdGguaW11bChoMSBeIChoMSA+Pj4gMTMpLCAzMjY2NDg5OTA5KTtcbiAgICByZXR1cm4gKDQyOTQ5NjcyOTYgKiAoMjA5NzE1MSAmIGgyKSArIChoMSA+Pj4gMCkpLnRvU3RyaW5nKDE2KTtcbn1cbiIsImltcG9ydCB7IE1vZGFsLCBBcHAsIE1hcmtkb3duUmVuZGVyZXIsIE5vdGljZSwgUGxhdGZvcm0sIFRGaWxlLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHR5cGUgU1JQbHVnaW4gZnJvbSBcInNyYy9tYWluXCI7XG5pbXBvcnQgeyBDYXJkLCBzY2hlZHVsZSwgdGV4dEludGVydmFsLCBSZXZpZXdSZXNwb25zZSB9IGZyb20gXCJzcmMvc2NoZWR1bGluZ1wiO1xuaW1wb3J0IHsgQ2FyZFR5cGUgfSBmcm9tIFwic3JjL3R5cGVzXCI7XG5pbXBvcnQge1xuICAgIENPTExBUFNFX0lDT04sXG4gICAgTVVMVElfU0NIRURVTElOR19FWFRSQUNUT1IsXG4gICAgTEVHQUNZX1NDSEVEVUxJTkdfRVhUUkFDVE9SLFxufSBmcm9tIFwic3JjL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZXNjYXBlUmVnZXhTdHJpbmcsIGN5cmI1MyB9IGZyb20gXCJzcmMvdXRpbHNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwic3JjL2xhbmcvaGVscGVyc1wiO1xuXG5leHBvcnQgZW51bSBGbGFzaGNhcmRNb2RhbE1vZGUge1xuICAgIERlY2tzTGlzdCxcbiAgICBGcm9udCxcbiAgICBCYWNrLFxuICAgIENsb3NlZCxcbn1cblxuZXhwb3J0IGNsYXNzIEZsYXNoY2FyZE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICAgIHB1YmxpYyBwbHVnaW46IFNSUGx1Z2luO1xuICAgIHB1YmxpYyBhbnN3ZXJCdG46IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBmbGFzaGNhcmRWaWV3OiBIVE1MRWxlbWVudDtcbiAgICBwdWJsaWMgaGFyZEJ0bjogSFRNTEVsZW1lbnQ7XG4gICAgcHVibGljIGdvb2RCdG46IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBlYXN5QnRuOiBIVE1MRWxlbWVudDtcbiAgICBwdWJsaWMgcmVzcG9uc2VEaXY6IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBmaWxlTGlua1ZpZXc6IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyByZXNldExpbmtWaWV3OiBIVE1MRWxlbWVudDtcbiAgICBwdWJsaWMgY29udGV4dFZpZXc6IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBjdXJyZW50Q2FyZDogQ2FyZDtcbiAgICBwdWJsaWMgY3VycmVudENhcmRJZHg6IG51bWJlcjtcbiAgICBwdWJsaWMgY3VycmVudERlY2s6IERlY2s7XG4gICAgcHVibGljIGNoZWNrRGVjazogRGVjaztcbiAgICBwdWJsaWMgbW9kZTogRmxhc2hjYXJkTW9kYWxNb2RlO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogU1JQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcblxuICAgICAgICB0aGlzLnRpdGxlRWwuc2V0VGV4dCh0KFwiRGVja3NcIikpO1xuXG4gICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZW50RWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vZGFsRWwuc3R5bGUuaGVpZ2h0ID0gdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRIZWlnaHRQZXJjZW50YWdlICsgXCIlXCI7XG4gICAgICAgIHRoaXMubW9kYWxFbC5zdHlsZS53aWR0aCA9IHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuZmxhc2hjYXJkV2lkdGhQZXJjZW50YWdlICsgXCIlXCI7XG5cbiAgICAgICAgdGhpcy5jb250ZW50RWwuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgICAgIHRoaXMuY29udGVudEVsLnN0eWxlLmhlaWdodCA9IFwiOTIlXCI7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmFkZENsYXNzKFwic3ItbW9kYWwtY29udGVudFwiKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5Lm9ua2V5cHJlc3MgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMubW9kZSAhPT0gRmxhc2hjYXJkTW9kYWxNb2RlLkRlY2tzTGlzdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgIT09IEZsYXNoY2FyZE1vZGFsTW9kZS5DbG9zZWQgJiYgZS5jb2RlID09PSBcIktleVNcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREZWNrLmRlbGV0ZUZsYXNoY2FyZEF0SW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkSWR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5pc0R1ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5jYXJkVHlwZSA9PT0gQ2FyZFR5cGUuQ2xvemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnVyeVNpYmxpbmdDYXJkcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGVjay5uZXh0Q2FyZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPT09IEZsYXNoY2FyZE1vZGFsTW9kZS5Gcm9udCAmJlxuICAgICAgICAgICAgICAgICAgICAoZS5jb2RlID09PSBcIlNwYWNlXCIgfHwgZS5jb2RlID09PSBcIkVudGVyXCIpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Fuc3dlcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSBGbGFzaGNhcmRNb2RhbE1vZGUuQmFjaykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIk51bXBhZDFcIiB8fCBlLmNvZGUgPT09IFwiRGlnaXQxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JldmlldyhSZXZpZXdSZXNwb25zZS5IYXJkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLmNvZGUgPT09IFwiTnVtcGFkMlwiIHx8IGUuY29kZSA9PT0gXCJEaWdpdDJcIiB8fCBlLmNvZGUgPT09IFwiU3BhY2VcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmV2aWV3KFJldmlld1Jlc3BvbnNlLkdvb2QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGUuY29kZSA9PT0gXCJOdW1wYWQzXCIgfHwgZS5jb2RlID09PSBcIkRpZ2l0M1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NSZXZpZXcoUmV2aWV3UmVzcG9uc2UuRWFzeSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5jb2RlID09PSBcIk51bXBhZDBcIiB8fCBlLmNvZGUgPT09IFwiRGlnaXQwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JldmlldyhSZXZpZXdSZXNwb25zZS5SZXNldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgb25PcGVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlY2tzTGlzdCgpO1xuICAgIH1cblxuICAgIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW9kZSA9IEZsYXNoY2FyZE1vZGFsTW9kZS5DbG9zZWQ7XG4gICAgfVxuXG4gICAgZGVja3NMaXN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vZGUgPSBGbGFzaGNhcmRNb2RhbE1vZGUuRGVja3NMaXN0O1xuICAgICAgICB0aGlzLnRpdGxlRWwuc2V0VGV4dCh0KFwiRGVja3NcIikpO1xuICAgICAgICB0aGlzLnRpdGxlRWwuaW5uZXJIVE1MICs9XG4gICAgICAgICAgICAnPHAgc3R5bGU9XCJtYXJnaW46MHB4O2xpbmUtaGVpZ2h0OjEycHg7XCI+JyArXG4gICAgICAgICAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiM0Y2FmNTA7Y29sb3I6I2ZmZmZmZjtcIiBhcmlhLWxhYmVsPVwiJyArXG4gICAgICAgICAgICB0KFwiRHVlIGNhcmRzXCIpICtcbiAgICAgICAgICAgICdcIiBjbGFzcz1cInRhZy1wYW5lLXRhZy1jb3VudCB0cmVlLWl0ZW0tZmxhaXJcIj4nICtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLmRlY2tUcmVlLmR1ZUZsYXNoY2FyZHNDb3VudCArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiMyMTk2ZjM7XCIgYXJpYS1sYWJlbD1cIicgK1xuICAgICAgICAgICAgdChcIk5ldyBjYXJkc1wiKSArXG4gICAgICAgICAgICAnXCIgY2xhc3M9XCJ0YWctcGFuZS10YWctY291bnQgdHJlZS1pdGVtLWZsYWlyIHNyLWRlY2stY291bnRzXCI+JyArXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5kZWNrVHJlZS5uZXdGbGFzaGNhcmRzQ291bnQgK1xuICAgICAgICAgICAgXCI8L3NwYW4+XCIgK1xuICAgICAgICAgICAgJzxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjojZmY3MDQzO1wiIGFyaWEtbGFiZWw9XCInICtcbiAgICAgICAgICAgIHQoXCJUb3RhbCBjYXJkc1wiKSArXG4gICAgICAgICAgICAnXCIgY2xhc3M9XCJ0YWctcGFuZS10YWctY291bnQgdHJlZS1pdGVtLWZsYWlyIHNyLWRlY2stY291bnRzXCI+JyArXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5kZWNrVHJlZS50b3RhbEZsYXNoY2FyZHMgK1xuICAgICAgICAgICAgXCI8L3NwYW4+XCIgK1xuICAgICAgICAgICAgXCI8L3A+XCI7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHRoaXMuY29udGVudEVsLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic3ItZmxhc2hjYXJkLXZpZXdcIik7XG5cbiAgICAgICAgZm9yIChsZXQgZGVjayBvZiB0aGlzLnBsdWdpbi5kZWNrVHJlZS5zdWJkZWNrcykge1xuICAgICAgICAgICAgZGVjay5yZW5kZXIodGhpcy5jb250ZW50RWwsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBDYXJkc1ZpZXcoKSB7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy5maWxlTGlua1ZpZXcgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoXCJzci1saW5rXCIpO1xuICAgICAgICB0aGlzLmZpbGVMaW5rVmlldy5zZXRUZXh0KHQoXCJPcGVuIGZpbGVcIikpO1xuICAgICAgICBpZiAodGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaG93RmlsZU5hbWVJbkZpbGVMaW5rKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVMaW5rVmlldy5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIHQoXCJPcGVuIGZpbGVcIikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsZUxpbmtWaWV3LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoXykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLm9wZW5GaWxlKHRoaXMuY3VycmVudENhcmQubm90ZSk7XG4gICAgICAgICAgICBsZXQgYWN0aXZlVmlldzogTWFya2Rvd25WaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KSE7XG4gICAgICAgICAgICBhY3RpdmVWaWV3LmVkaXRvci5zZXRDdXJzb3Ioe1xuICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMuY3VycmVudENhcmQubGluZU5vLFxuICAgICAgICAgICAgICAgIGNoOiAwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVzZXRMaW5rVmlldyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdihcInNyLWxpbmtcIik7XG4gICAgICAgIHRoaXMucmVzZXRMaW5rVmlldy5zZXRUZXh0KHQoXCJSZXNldCBjYXJkJ3MgcHJvZ3Jlc3NcIikpO1xuICAgICAgICB0aGlzLnJlc2V0TGlua1ZpZXcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NSZXZpZXcoUmV2aWV3UmVzcG9uc2UuUmVzZXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNldExpbmtWaWV3LnN0eWxlLmZsb2F0ID0gXCJyaWdodFwiO1xuXG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNob3dDb250ZXh0SW5DYXJkcykge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0VmlldyA9IHRoaXMuY29udGVudEVsLmNyZWF0ZURpdigpO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0Vmlldy5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNyLWNvbnRleHRcIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZsYXNoY2FyZFZpZXcgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmxhc2hjYXJkVmlldy5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNyLWZsYXNoY2FyZC12aWV3XCIpO1xuXG4gICAgICAgIHRoaXMucmVzcG9uc2VEaXYgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoXCJzci1yZXNwb25zZVwiKTtcblxuICAgICAgICB0aGlzLmhhcmRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmhhcmRCdG4uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzci1oYXJkLWJ0blwiKTtcbiAgICAgICAgdGhpcy5oYXJkQnRuLnNldFRleHQodChcIkhhcmRcIikpO1xuICAgICAgICB0aGlzLmhhcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NSZXZpZXcoUmV2aWV3UmVzcG9uc2UuSGFyZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlc3BvbnNlRGl2LmFwcGVuZENoaWxkKHRoaXMuaGFyZEJ0bik7XG5cbiAgICAgICAgdGhpcy5nb29kQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5nb29kQnRuLnNldEF0dHJpYnV0ZShcImlkXCIsIFwic3ItZ29vZC1idG5cIik7XG4gICAgICAgIHRoaXMuZ29vZEJ0bi5zZXRUZXh0KHQoXCJHb29kXCIpKTtcbiAgICAgICAgdGhpcy5nb29kQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoXykgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmV2aWV3KFJldmlld1Jlc3BvbnNlLkdvb2QpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNwb25zZURpdi5hcHBlbmRDaGlsZCh0aGlzLmdvb2RCdG4pO1xuXG4gICAgICAgIHRoaXMuZWFzeUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuZWFzeUJ0bi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNyLWVhc3ktYnRuXCIpO1xuICAgICAgICB0aGlzLmVhc3lCdG4uc2V0VGV4dCh0KFwiRWFzeVwiKSk7XG4gICAgICAgIHRoaXMuZWFzeUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKF8pID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1JldmlldyhSZXZpZXdSZXNwb25zZS5FYXN5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzcG9uc2VEaXYuYXBwZW5kQ2hpbGQodGhpcy5lYXN5QnRuKTtcbiAgICAgICAgdGhpcy5yZXNwb25zZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgdGhpcy5hbnN3ZXJCdG4gPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJCdG4uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzci1zaG93LWFuc3dlclwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJCdG4uc2V0VGV4dCh0KFwiU2hvdyBBbnN3ZXJcIikpO1xuICAgICAgICB0aGlzLmFuc3dlckJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKF8pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Fuc3dlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93QW5zd2VyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vZGUgPSBGbGFzaGNhcmRNb2RhbE1vZGUuQmFjaztcblxuICAgICAgICB0aGlzLmFuc3dlckJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMucmVzcG9uc2VEaXYuc3R5bGUuZGlzcGxheSA9IFwiZ3JpZFwiO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDYXJkLmlzRHVlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0TGlua1ZpZXcuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lLWJsb2NrXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5jYXJkVHlwZSAhPT0gQ2FyZFR5cGUuQ2xvemUpIHtcbiAgICAgICAgICAgIGxldCBocjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIik7XG4gICAgICAgICAgICBoci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcInNyLWhyLWNhcmQtZGl2aWRlXCIpO1xuICAgICAgICAgICAgdGhpcy5mbGFzaGNhcmRWaWV3LmFwcGVuZENoaWxkKGhyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmxhc2hjYXJkVmlldy5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJNYXJrZG93bldyYXBwZXIodGhpcy5jdXJyZW50Q2FyZC5iYWNrLCB0aGlzLmZsYXNoY2FyZFZpZXcpO1xuICAgIH1cblxuICAgIGFzeW5jIHByb2Nlc3NSZXZpZXcocmVzcG9uc2U6IFJldmlld1Jlc3BvbnNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGxldCBpbnRlcnZhbDogbnVtYmVyLCBlYXNlOiBudW1iZXIsIGR1ZTtcblxuICAgICAgICB0aGlzLmN1cnJlbnREZWNrLmRlbGV0ZUZsYXNoY2FyZEF0SW5kZXgodGhpcy5jdXJyZW50Q2FyZElkeCwgdGhpcy5jdXJyZW50Q2FyZC5pc0R1ZSk7XG4gICAgICAgIGlmIChyZXNwb25zZSAhPT0gUmV2aWV3UmVzcG9uc2UuUmVzZXQpIHtcbiAgICAgICAgICAgIC8vIHNjaGVkdWxlZCBjYXJkXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5pc0R1ZSkge1xuICAgICAgICAgICAgICAgIGxldCBzY2hlZE9iajogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHNjaGVkdWxlKFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5pbnRlcnZhbCEsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuZWFzZSEsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuZGVsYXlCZWZvcmVSZXZpZXchLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLnNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5kdWVEYXRlc0ZsYXNoY2FyZHNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGludGVydmFsID0gc2NoZWRPYmouaW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgZWFzZSA9IHNjaGVkT2JqLmVhc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzY2hlZE9iajogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHNjaGVkdWxlKFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5iYXNlRWFzZSxcbiAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZHVlRGF0ZXNGbGFzaGNhcmRzXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNjaGVkT2JqLmludGVydmFsO1xuICAgICAgICAgICAgICAgIGVhc2UgPSBzY2hlZE9iai5lYXNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkdWUgPSB3aW5kb3cubW9tZW50KERhdGUubm93KCkgKyBpbnRlcnZhbCAqIDI0ICogMzYwMCAqIDEwMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5pbnRlcnZhbCA9IDEuMDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuZWFzZSA9IHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYmFzZUVhc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5pc0R1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2suZHVlRmxhc2hjYXJkcy5wdXNoKHRoaXMuY3VycmVudENhcmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREZWNrLm5ld0ZsYXNoY2FyZHMucHVzaCh0aGlzLmN1cnJlbnRDYXJkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGR1ZSA9IHdpbmRvdy5tb21lbnQoRGF0ZS5ub3coKSk7XG4gICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJDYXJkJ3MgcHJvZ3Jlc3MgaGFzIGJlZW4gcmVzZXQuXCIpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2submV4dENhcmQodGhpcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZHVlU3RyaW5nOiBzdHJpbmcgPSBkdWUuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKTtcblxuICAgICAgICBsZXQgZmlsZVRleHQ6IHN0cmluZyA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGhpcy5jdXJyZW50Q2FyZC5ub3RlKTtcbiAgICAgICAgbGV0IHJlcGxhY2VtZW50UmVnZXggPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ2V4U3RyaW5nKHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQpLCBcImdtXCIpO1xuXG4gICAgICAgIGxldCBzZXA6IHN0cmluZyA9IHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuY2FyZENvbW1lbnRPblNhbWVMaW5lID8gXCIgXCIgOiBcIlxcblwiO1xuICAgICAgICAvLyBPdmVycmlkZSBzZXBhcmF0b3IgaWYgbGFzdCBibG9jayBpcyBhIGNvZGVibG9ja1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5jYXJkVGV4dC5lbmRzV2l0aChcImBgYFwiKSAmJiBzZXAgIT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgIHNlcCA9IFwiXFxuXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBpZiB3ZSdyZSBhZGRpbmcgc2NoZWR1bGluZyBpbmZvcm1hdGlvbiB0byB0aGUgZmxhc2hjYXJkXG4gICAgICAgIC8vIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q2FyZC5jYXJkVGV4dC5sYXN0SW5kZXhPZihcIjwhLS1TUjpcIikgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0ID1cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0ICsgc2VwICsgYDwhLS1TUjohJHtkdWVTdHJpbmd9LCR7aW50ZXJ2YWx9LCR7ZWFzZX0tLT5gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNjaGVkdWxpbmc6IFJlZ0V4cE1hdGNoQXJyYXlbXSA9IFtcbiAgICAgICAgICAgICAgICAuLi50aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0Lm1hdGNoQWxsKE1VTFRJX1NDSEVEVUxJTkdfRVhUUkFDVE9SKSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAoc2NoZWR1bGluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzY2hlZHVsaW5nID0gWy4uLnRoaXMuY3VycmVudENhcmQuY2FyZFRleHQubWF0Y2hBbGwoTEVHQUNZX1NDSEVEVUxJTkdfRVhUUkFDVE9SKV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjdXJyQ2FyZFNjaGVkOiBzdHJpbmdbXSA9IFtcIjBcIiwgZHVlU3RyaW5nLCBpbnRlcnZhbC50b1N0cmluZygpLCBlYXNlLnRvU3RyaW5nKCldO1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudENhcmQuaXNEdWUpIHtcbiAgICAgICAgICAgICAgICBzY2hlZHVsaW5nW3RoaXMuY3VycmVudENhcmQuc2libGluZ0lkeF0gPSBjdXJyQ2FyZFNjaGVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2hlZHVsaW5nLnB1c2goY3VyckNhcmRTY2hlZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQgPSB0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0LnJlcGxhY2UoLzwhLS1TUjouKy0tPi9nbSwgXCJcIik7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDYXJkLmNhcmRUZXh0ICs9IFwiPCEtLVNSOlwiO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2hlZHVsaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Q2FyZC5jYXJkVGV4dCArPSBgISR7c2NoZWR1bGluZ1tpXVsxXX0sJHtzY2hlZHVsaW5nW2ldWzJdfSwke3NjaGVkdWxpbmdbaV1bM119YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQgKz0gXCItLT5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbGVUZXh0ID0gZmlsZVRleHQucmVwbGFjZShyZXBsYWNlbWVudFJlZ2V4LCAoXykgPT4gdGhpcy5jdXJyZW50Q2FyZC5jYXJkVGV4dCk7XG4gICAgICAgIGZvciAobGV0IHNpYmxpbmcgb2YgdGhpcy5jdXJyZW50Q2FyZC5zaWJsaW5ncykge1xuICAgICAgICAgICAgc2libGluZy5jYXJkVGV4dCA9IHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLmRhdGEuc2V0dGluZ3MuYnVyeVNpYmxpbmdDYXJkcykge1xuICAgICAgICAgICAgdGhpcy5idXJ5U2libGluZ0NhcmRzKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KHRoaXMuY3VycmVudENhcmQubm90ZSwgZmlsZVRleHQpO1xuICAgICAgICB0aGlzLmN1cnJlbnREZWNrLm5leHRDYXJkKHRoaXMpO1xuICAgIH1cblxuICAgIGFzeW5jIGJ1cnlTaWJsaW5nQ2FyZHModGlsbE5leHREYXk6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRpbGxOZXh0RGF5KSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5kYXRhLmJ1cnlMaXN0LnB1c2goY3lyYjUzKHRoaXMuY3VycmVudENhcmQuY2FyZFRleHQpKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVQbHVnaW5EYXRhKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBzaWJsaW5nIG9mIHRoaXMuY3VycmVudENhcmQuc2libGluZ3MpIHtcbiAgICAgICAgICAgIGxldCBkdWVJZHggPSB0aGlzLmN1cnJlbnREZWNrLmR1ZUZsYXNoY2FyZHMuaW5kZXhPZihzaWJsaW5nKTtcbiAgICAgICAgICAgIGxldCBuZXdJZHggPSB0aGlzLmN1cnJlbnREZWNrLm5ld0ZsYXNoY2FyZHMuaW5kZXhPZihzaWJsaW5nKTtcblxuICAgICAgICAgICAgaWYgKGR1ZUlkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGVjay5kZWxldGVGbGFzaGNhcmRBdEluZGV4KFxuICAgICAgICAgICAgICAgICAgICBkdWVJZHgsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2suZHVlRmxhc2hjYXJkc1tkdWVJZHhdLmlzRHVlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG5ld0lkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50RGVjay5kZWxldGVGbGFzaGNhcmRBdEluZGV4KFxuICAgICAgICAgICAgICAgICAgICBuZXdJZHgsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERlY2submV3Rmxhc2hjYXJkc1tuZXdJZHhdLmlzRHVlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNsaWdodGx5IG1vZGlmaWVkIHZlcnNpb24gb2YgdGhlIHJlbmRlck1hcmtkb3duIGZ1bmN0aW9uIGluXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21nbWV5ZXJzL29ic2lkaWFuLWthbmJhbi9ibG9iL21haW4vc3JjL0thbmJhblZpZXcudHN4XG4gICAgYXN5bmMgcmVuZGVyTWFya2Rvd25XcmFwcGVyKG1hcmtkb3duU3RyaW5nOiBzdHJpbmcsIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBNYXJrZG93blJlbmRlcmVyLnJlbmRlck1hcmtkb3duKFxuICAgICAgICAgICAgbWFya2Rvd25TdHJpbmcsXG4gICAgICAgICAgICBjb250YWluZXJFbCxcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENhcmQubm90ZS5wYXRoLFxuICAgICAgICAgICAgdGhpcy5wbHVnaW5cbiAgICAgICAgKTtcbiAgICAgICAgY29udGFpbmVyRWwuZmluZEFsbChcIi5pbnRlcm5hbC1lbWJlZFwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNyYzogc3RyaW5nID0gZWwuZ2V0QXR0cmlidXRlKFwic3JjXCIpITtcbiAgICAgICAgICAgIGxldCB0YXJnZXQ6IFRGaWxlIHwgbnVsbCB8IGZhbHNlID1cbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3JjID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3Qoc3JjLCB0aGlzLmN1cnJlbnRDYXJkLm5vdGUucGF0aCk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgVEZpbGUgJiYgdGFyZ2V0LmV4dGVuc2lvbiAhPT0gXCJtZFwiKSB7XG4gICAgICAgICAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBlbC5jcmVhdGVFbChcbiAgICAgICAgICAgICAgICAgICAgXCJpbWdcIixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogdGhpcy5wbHVnaW4uYXBwLnZhdWx0LmdldFJlc291cmNlUGF0aCh0YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKGltZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShcIndpZHRoXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBlbC5nZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpbWcuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShcImFsdFwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKFwiYWx0XCIsIGVsLmdldEF0dHJpYnV0ZShcImFsdFwiKSEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbC5hZGRDbGFzc2VzKFtcImltYWdlLWVtYmVkXCIsIFwiaXMtbG9hZGVkXCJdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlsZSBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgICAgLy8gZGlzcGxheSBkZWFkIGxpbmtcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBlbC5pbm5lclRleHQgPSBzcmM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlY2sge1xuICAgIHB1YmxpYyBkZWNrTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBuZXdGbGFzaGNhcmRzOiBDYXJkW107XG4gICAgcHVibGljIG5ld0ZsYXNoY2FyZHNDb3VudDogbnVtYmVyID0gMDsgLy8gY291bnRzIHRob3NlIGluIHN1YmRlY2tzIHRvb1xuICAgIHB1YmxpYyBkdWVGbGFzaGNhcmRzOiBDYXJkW107XG4gICAgcHVibGljIGR1ZUZsYXNoY2FyZHNDb3VudDogbnVtYmVyID0gMDsgLy8gY291bnRzIHRob3NlIGluIHN1YmRlY2tzIHRvb1xuICAgIHB1YmxpYyB0b3RhbEZsYXNoY2FyZHM6IG51bWJlciA9IDA7IC8vIGNvdW50cyB0aG9zZSBpbiBzdWJkZWNrcyB0b29cbiAgICBwdWJsaWMgc3ViZGVja3M6IERlY2tbXTtcbiAgICBwdWJsaWMgcGFyZW50OiBEZWNrIHwgbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGRlY2tOYW1lOiBzdHJpbmcsIHBhcmVudDogRGVjayB8IG51bGwpIHtcbiAgICAgICAgdGhpcy5kZWNrTmFtZSA9IGRlY2tOYW1lO1xuICAgICAgICB0aGlzLm5ld0ZsYXNoY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5uZXdGbGFzaGNhcmRzQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmR1ZUZsYXNoY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kdWVGbGFzaGNhcmRzQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnRvdGFsRmxhc2hjYXJkcyA9IDA7XG4gICAgICAgIHRoaXMuc3ViZGVja3MgPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuXG4gICAgY3JlYXRlRGVjayhkZWNrUGF0aDogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGRlY2tQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlY2tOYW1lOiBzdHJpbmcgPSBkZWNrUGF0aC5zaGlmdCgpITtcbiAgICAgICAgZm9yIChsZXQgZGVjayBvZiB0aGlzLnN1YmRlY2tzKSB7XG4gICAgICAgICAgICBpZiAoZGVja05hbWUgPT09IGRlY2suZGVja05hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWNrLmNyZWF0ZURlY2soZGVja1BhdGgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWNrOiBEZWNrID0gbmV3IERlY2soZGVja05hbWUsIHRoaXMpO1xuICAgICAgICB0aGlzLnN1YmRlY2tzLnB1c2goZGVjayk7XG4gICAgICAgIGRlY2suY3JlYXRlRGVjayhkZWNrUGF0aCk7XG4gICAgfVxuXG4gICAgaW5zZXJ0Rmxhc2hjYXJkKGRlY2tQYXRoOiBzdHJpbmdbXSwgY2FyZE9iajogQ2FyZCk6IHZvaWQge1xuICAgICAgICBpZiAoY2FyZE9iai5pc0R1ZSkge1xuICAgICAgICAgICAgdGhpcy5kdWVGbGFzaGNhcmRzQ291bnQrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmV3Rmxhc2hjYXJkc0NvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b3RhbEZsYXNoY2FyZHMrKztcblxuICAgICAgICBpZiAoZGVja1BhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoY2FyZE9iai5pc0R1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHVlRmxhc2hjYXJkcy5wdXNoKGNhcmRPYmopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5ld0ZsYXNoY2FyZHMucHVzaChjYXJkT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWNrTmFtZTogc3RyaW5nID0gZGVja1BhdGguc2hpZnQoKSE7XG4gICAgICAgIGZvciAobGV0IGRlY2sgb2YgdGhpcy5zdWJkZWNrcykge1xuICAgICAgICAgICAgaWYgKGRlY2tOYW1lID09PSBkZWNrLmRlY2tOYW1lKSB7XG4gICAgICAgICAgICAgICAgZGVjay5pbnNlcnRGbGFzaGNhcmQoZGVja1BhdGgsIGNhcmRPYmopO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvdW50IGZsYXNoY2FyZHMgdGhhdCBoYXZlIGVpdGhlciBiZWVuIGJ1cmllZFxuICAgIC8vIG9yIGFyZW4ndCBkdWUgeWV0XG4gICAgY291bnRGbGFzaGNhcmQoZGVja1BhdGg6IHN0cmluZ1tdLCBuOiBudW1iZXIgPSAxKTogdm9pZCB7XG4gICAgICAgIHRoaXMudG90YWxGbGFzaGNhcmRzICs9IG47XG5cbiAgICAgICAgbGV0IGRlY2tOYW1lOiBzdHJpbmcgPSBkZWNrUGF0aC5zaGlmdCgpITtcbiAgICAgICAgZm9yIChsZXQgZGVjayBvZiB0aGlzLnN1YmRlY2tzKSB7XG4gICAgICAgICAgICBpZiAoZGVja05hbWUgPT09IGRlY2suZGVja05hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWNrLmNvdW50Rmxhc2hjYXJkKGRlY2tQYXRoLCBuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWxldGVGbGFzaGNhcmRBdEluZGV4KGluZGV4OiBudW1iZXIsIGNhcmRJc0R1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAoY2FyZElzRHVlKSB7XG4gICAgICAgICAgICB0aGlzLmR1ZUZsYXNoY2FyZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmV3Rmxhc2hjYXJkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlY2s6IERlY2sgfCBudWxsID0gdGhpcztcbiAgICAgICAgd2hpbGUgKGRlY2sgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjYXJkSXNEdWUpIHtcbiAgICAgICAgICAgICAgICBkZWNrLmR1ZUZsYXNoY2FyZHNDb3VudC0tO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWNrLm5ld0ZsYXNoY2FyZHNDb3VudC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVjayA9IGRlY2sucGFyZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc29ydFN1YmRlY2tzTGlzdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJkZWNrcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5kZWNrTmFtZSA8IGIuZGVja05hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGEuZGVja05hbWUgPiBiLmRlY2tOYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgZGVjayBvZiB0aGlzLnN1YmRlY2tzKSB7XG4gICAgICAgICAgICBkZWNrLnNvcnRTdWJkZWNrc0xpc3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcihjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIG1vZGFsOiBGbGFzaGNhcmRNb2RhbCk6IHZvaWQge1xuICAgICAgICBsZXQgZGVja1ZpZXc6IEhUTUxFbGVtZW50ID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KFwidHJlZS1pdGVtXCIpO1xuXG4gICAgICAgIGxldCBkZWNrVmlld1NlbGY6IEhUTUxFbGVtZW50ID0gZGVja1ZpZXcuY3JlYXRlRGl2KFxuICAgICAgICAgICAgXCJ0cmVlLWl0ZW0tc2VsZiB0YWctcGFuZS10YWcgaXMtY2xpY2thYmxlXCJcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IGNvbGxhcHNlZDogYm9vbGVhbiA9IHRydWU7XG4gICAgICAgIGxldCBjb2xsYXBzZUljb25FbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc3ViZGVja3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29sbGFwc2VJY29uRWwgPSBkZWNrVmlld1NlbGYuY3JlYXRlRGl2KFwidHJlZS1pdGVtLWljb24gY29sbGFwc2UtaWNvblwiKTtcbiAgICAgICAgICAgIGNvbGxhcHNlSWNvbkVsLmlubmVySFRNTCA9IENPTExBUFNFX0lDT047XG4gICAgICAgICAgICAoY29sbGFwc2VJY29uRWwuY2hpbGROb2Rlc1swXSBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoLTkwZGVnKVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlY2tWaWV3SW5uZXI6IEhUTUxFbGVtZW50ID0gZGVja1ZpZXdTZWxmLmNyZWF0ZURpdihcInRyZWUtaXRlbS1pbm5lclwiKTtcbiAgICAgICAgZGVja1ZpZXdJbm5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKF8pID0+IHtcbiAgICAgICAgICAgIG1vZGFsLmN1cnJlbnREZWNrID0gdGhpcztcbiAgICAgICAgICAgIG1vZGFsLmNoZWNrRGVjayA9IHRoaXMucGFyZW50ITtcbiAgICAgICAgICAgIG1vZGFsLnNldHVwQ2FyZHNWaWV3KCk7XG4gICAgICAgICAgICB0aGlzLm5leHRDYXJkKG1vZGFsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBkZWNrVmlld0lubmVyVGV4dDogSFRNTEVsZW1lbnQgPSBkZWNrVmlld0lubmVyLmNyZWF0ZURpdihcInRhZy1wYW5lLXRhZy10ZXh0XCIpO1xuICAgICAgICBkZWNrVmlld0lubmVyVGV4dC5pbm5lckhUTUwgKz0gYDxzcGFuIGNsYXNzPVwidGFnLXBhbmUtdGFnLXNlbGZcIj4ke3RoaXMuZGVja05hbWV9PC9zcGFuPmA7XG4gICAgICAgIGxldCBkZWNrVmlld091dGVyOiBIVE1MRWxlbWVudCA9IGRlY2tWaWV3U2VsZi5jcmVhdGVEaXYoXCJ0cmVlLWl0ZW0tZmxhaXItb3V0ZXJcIik7XG4gICAgICAgIGRlY2tWaWV3T3V0ZXIuaW5uZXJIVE1MICs9XG4gICAgICAgICAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiM0Y2FmNTA7XCIgY2xhc3M9XCJ0YWctcGFuZS10YWctY291bnQgdHJlZS1pdGVtLWZsYWlyIHNyLWRlY2stY291bnRzXCI+JyArXG4gICAgICAgICAgICB0aGlzLmR1ZUZsYXNoY2FyZHNDb3VudCArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiMyMTk2ZjM7XCIgY2xhc3M9XCJ0YWctcGFuZS10YWctY291bnQgdHJlZS1pdGVtLWZsYWlyIHNyLWRlY2stY291bnRzXCI+JyArXG4gICAgICAgICAgICB0aGlzLm5ld0ZsYXNoY2FyZHNDb3VudCArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICAnPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiNmZjcwNDM7XCIgY2xhc3M9XCJ0YWctcGFuZS10YWctY291bnQgdHJlZS1pdGVtLWZsYWlyIHNyLWRlY2stY291bnRzXCI+JyArXG4gICAgICAgICAgICB0aGlzLnRvdGFsRmxhc2hjYXJkcyArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIjtcblxuICAgICAgICBsZXQgZGVja1ZpZXdDaGlsZHJlbjogSFRNTEVsZW1lbnQgPSBkZWNrVmlldy5jcmVhdGVEaXYoXCJ0cmVlLWl0ZW0tY2hpbGRyZW5cIik7XG4gICAgICAgIGRlY2tWaWV3Q2hpbGRyZW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBpZiAodGhpcy5zdWJkZWNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb2xsYXBzZUljb25FbCEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICAgICAoY29sbGFwc2VJY29uRWwhLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGRlY2tWaWV3Q2hpbGRyZW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoY29sbGFwc2VJY29uRWwhLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zZm9ybSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJvdGF0ZSgtOTBkZWcpXCI7XG4gICAgICAgICAgICAgICAgICAgIGRlY2tWaWV3Q2hpbGRyZW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb2xsYXBzZWQgPSAhY29sbGFwc2VkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgZGVjayBvZiB0aGlzLnN1YmRlY2tzKSB7XG4gICAgICAgICAgICBkZWNrLnJlbmRlcihkZWNrVmlld0NoaWxkcmVuLCBtb2RhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0Q2FyZChtb2RhbDogRmxhc2hjYXJkTW9kYWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmV3Rmxhc2hjYXJkcy5sZW5ndGggKyB0aGlzLmR1ZUZsYXNoY2FyZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kdWVGbGFzaGNhcmRzQ291bnQgKyB0aGlzLm5ld0ZsYXNoY2FyZHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBkZWNrIG9mIHRoaXMuc3ViZGVja3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2suZHVlRmxhc2hjYXJkc0NvdW50ICsgZGVjay5uZXdGbGFzaGNhcmRzQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50RGVjayA9IGRlY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWNrLm5leHRDYXJkKG1vZGFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50ID09IG1vZGFsLmNoZWNrRGVjaykge1xuICAgICAgICAgICAgICAgIG1vZGFsLmRlY2tzTGlzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudCEubmV4dENhcmQobW9kYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kYWwucmVzcG9uc2VEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBtb2RhbC5yZXNldExpbmtWaWV3LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgbW9kYWwudGl0bGVFbC5zZXRUZXh0KFxuICAgICAgICAgICAgYCR7dGhpcy5kZWNrTmFtZX0gLSAke3RoaXMuZHVlRmxhc2hjYXJkc0NvdW50ICsgdGhpcy5uZXdGbGFzaGNhcmRzQ291bnR9YFxuICAgICAgICApO1xuXG4gICAgICAgIG1vZGFsLmFuc3dlckJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJpbml0aWFsXCI7XG4gICAgICAgIG1vZGFsLmZsYXNoY2FyZFZpZXcuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgbW9kYWwubW9kZSA9IEZsYXNoY2FyZE1vZGFsTW9kZS5Gcm9udDtcblxuICAgICAgICBpZiAodGhpcy5kdWVGbGFzaGNhcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChtb2RhbC5wbHVnaW4uZGF0YS5zZXR0aW5ncy5yYW5kb21pemVDYXJkT3JkZXIpIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZElkeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuZHVlRmxhc2hjYXJkcy5sZW5ndGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZElkeCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZCA9IHRoaXMuZHVlRmxhc2hjYXJkc1ttb2RhbC5jdXJyZW50Q2FyZElkeF07XG4gICAgICAgICAgICBtb2RhbC5yZW5kZXJNYXJrZG93bldyYXBwZXIobW9kYWwuY3VycmVudENhcmQuZnJvbnQsIG1vZGFsLmZsYXNoY2FyZFZpZXcpO1xuXG4gICAgICAgICAgICBsZXQgaGFyZEludGVydmFsOiBudW1iZXIgPSBzY2hlZHVsZShcbiAgICAgICAgICAgICAgICBSZXZpZXdSZXNwb25zZS5IYXJkLFxuICAgICAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkLmludGVydmFsISxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5lYXNlISxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5kZWxheUJlZm9yZVJldmlldyEsXG4gICAgICAgICAgICAgICAgbW9kYWwucGx1Z2luLmRhdGEuc2V0dGluZ3NcbiAgICAgICAgICAgICkuaW50ZXJ2YWw7XG4gICAgICAgICAgICBsZXQgZ29vZEludGVydmFsOiBudW1iZXIgPSBzY2hlZHVsZShcbiAgICAgICAgICAgICAgICBSZXZpZXdSZXNwb25zZS5Hb29kLFxuICAgICAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkLmludGVydmFsISxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5lYXNlISxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5kZWxheUJlZm9yZVJldmlldyEsXG4gICAgICAgICAgICAgICAgbW9kYWwucGx1Z2luLmRhdGEuc2V0dGluZ3NcbiAgICAgICAgICAgICkuaW50ZXJ2YWw7XG4gICAgICAgICAgICBsZXQgZWFzeUludGVydmFsOiBudW1iZXIgPSBzY2hlZHVsZShcbiAgICAgICAgICAgICAgICBSZXZpZXdSZXNwb25zZS5FYXN5LFxuICAgICAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkLmludGVydmFsISxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5lYXNlISxcbiAgICAgICAgICAgICAgICBtb2RhbC5jdXJyZW50Q2FyZC5kZWxheUJlZm9yZVJldmlldyEsXG4gICAgICAgICAgICAgICAgbW9kYWwucGx1Z2luLmRhdGEuc2V0dGluZ3NcbiAgICAgICAgICAgICkuaW50ZXJ2YWw7XG5cbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIG1vZGFsLmhhcmRCdG4uc2V0VGV4dCh0ZXh0SW50ZXJ2YWwoaGFyZEludGVydmFsLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgbW9kYWwuZ29vZEJ0bi5zZXRUZXh0KHRleHRJbnRlcnZhbChnb29kSW50ZXJ2YWwsIHRydWUpKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5lYXN5QnRuLnNldFRleHQodGV4dEludGVydmFsKGVhc3lJbnRlcnZhbCwgdHJ1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5oYXJkQnRuLnNldFRleHQodChcIkhhcmRcIikgKyBcIiAtIFwiICsgdGV4dEludGVydmFsKGhhcmRJbnRlcnZhbCwgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5nb29kQnRuLnNldFRleHQodChcIkdvb2RcIikgKyBcIiAtIFwiICsgdGV4dEludGVydmFsKGdvb2RJbnRlcnZhbCwgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5lYXN5QnRuLnNldFRleHQodChcIkVhc3lcIikgKyBcIiAtIFwiICsgdGV4dEludGVydmFsKGVhc3lJbnRlcnZhbCwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm5ld0ZsYXNoY2FyZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKG1vZGFsLnBsdWdpbi5kYXRhLnNldHRpbmdzLnJhbmRvbWl6ZUNhcmRPcmRlcikge1xuICAgICAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkSWR4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5uZXdGbGFzaGNhcmRzLmxlbmd0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkSWR4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1vZGFsLmN1cnJlbnRDYXJkID0gdGhpcy5uZXdGbGFzaGNhcmRzW21vZGFsLmN1cnJlbnRDYXJkSWR4XTtcbiAgICAgICAgICAgIG1vZGFsLnJlbmRlck1hcmtkb3duV3JhcHBlcihtb2RhbC5jdXJyZW50Q2FyZC5mcm9udCwgbW9kYWwuZmxhc2hjYXJkVmlldyk7XG5cbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIG1vZGFsLmhhcmRCdG4uc2V0VGV4dChcIjEuMGRcIik7XG4gICAgICAgICAgICAgICAgbW9kYWwuZ29vZEJ0bi5zZXRUZXh0KFwiMi41ZFwiKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5lYXN5QnRuLnNldFRleHQoXCIzLjVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb2RhbC5oYXJkQnRuLnNldFRleHQodChcIkhhcmRcIikgKyBcIiAtIDEuMCBcIiArIHQoXCJkYXlcIikpO1xuICAgICAgICAgICAgICAgIG1vZGFsLmdvb2RCdG4uc2V0VGV4dCh0KFwiR29vZFwiKSArIFwiIC0gMi41IFwiICsgdChcImRheXNcIikpO1xuICAgICAgICAgICAgICAgIG1vZGFsLmVhc3lCdG4uc2V0VGV4dCh0KFwiRWFzeVwiKSArIFwiIC0gMy41IFwiICsgdChcImRheXNcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGFsLnBsdWdpbi5kYXRhLnNldHRpbmdzLnNob3dDb250ZXh0SW5DYXJkcylcbiAgICAgICAgICAgIG1vZGFsLmNvbnRleHRWaWV3LnNldFRleHQobW9kYWwuY3VycmVudENhcmQuY29udGV4dCk7XG4gICAgICAgIGlmIChtb2RhbC5wbHVnaW4uZGF0YS5zZXR0aW5ncy5zaG93RmlsZU5hbWVJbkZpbGVMaW5rKVxuICAgICAgICAgICAgbW9kYWwuZmlsZUxpbmtWaWV3LnNldFRleHQobW9kYWwuY3VycmVudENhcmQubm90ZS5iYXNlbmFtZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTW9kYWwsIEFwcCwgTWFya2Rvd25SZW5kZXJlciwgUGxhdGZvcm0gfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHR5cGUgU1JQbHVnaW4gZnJvbSBcInNyYy9tYWluXCI7XG5pbXBvcnQgeyBnZXRLZXlzUHJlc2VydmVUeXBlIH0gZnJvbSBcInNyYy91dGlsc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9oZWxwZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0c01vZGFsIGV4dGVuZHMgTW9kYWwge1xuICAgIHByaXZhdGUgcGx1Z2luOiBTUlBsdWdpbjtcbiAgICBwcml2YXRlIGR1ZURhdGVzRmxhc2hjYXJkczogUmVjb3JkPG51bWJlciwgbnVtYmVyPjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBkdWVEYXRlc0ZsYXNoY2FyZHM6IFJlY29yZDxudW1iZXIsIG51bWJlcj4sIHBsdWdpbjogU1JQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMgPSBkdWVEYXRlc0ZsYXNoY2FyZHM7XG5cbiAgICAgICAgdGhpcy50aXRsZUVsLnNldFRleHQodChcIlN0YXRpc3RpY3NcIikpO1xuXG4gICAgICAgIHRoaXMubW9kYWxFbC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgdGhpcy5tb2RhbEVsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PcGVuKCk6IHZvaWQge1xuICAgICAgICBsZXQgeyBjb250ZW50RWwgfSA9IHRoaXM7XG5cbiAgICAgICAgY29udGVudEVsLmlubmVySFRNTCArPVxuICAgICAgICAgICAgXCI8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOmNlbnRlcic+XCIgK1xuICAgICAgICAgICAgXCI8c3Bhbj5cIiArXG4gICAgICAgICAgICB0KFwiTm90ZSB0aGF0IHRoaXMgcmVxdWlyZXMgdGhlIE9ic2lkaWFuIENoYXJ0cyBwbHVnaW4gdG8gd29ya1wiKSArXG4gICAgICAgICAgICBcIjwvc3Bhbj5cIiArXG4gICAgICAgICAgICBcIjxoMiBzdHlsZT0ndGV4dC1hbGlnbjpjZW50ZXInPlwiICtcbiAgICAgICAgICAgIHQoXCJGb3JlY2FzdFwiKSArXG4gICAgICAgICAgICBcIjwvaDI+XCIgK1xuICAgICAgICAgICAgXCI8aDQgc3R5bGU9J3RleHQtYWxpZ246Y2VudGVyJz5cIiArXG4gICAgICAgICAgICB0KFwiVGhlIG51bWJlciBvZiBjYXJkcyBkdWUgaW4gdGhlIGZ1dHVyZVwiKSArXG4gICAgICAgICAgICBcIjwvaDQ+XCIgK1xuICAgICAgICAgICAgXCI8L2Rpdj5cIjtcblxuICAgICAgICBsZXQgbWF4TjogbnVtYmVyID0gTWF0aC5tYXgoLi4uZ2V0S2V5c1ByZXNlcnZlVHlwZSh0aGlzLmR1ZURhdGVzRmxhc2hjYXJkcykpO1xuICAgICAgICBmb3IgKGxldCBkdWVPZmZzZXQgPSAwOyBkdWVPZmZzZXQgPD0gbWF4TjsgZHVlT2Zmc2V0KyspIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMuaGFzT3duUHJvcGVydHkoZHVlT2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHVlRGF0ZXNGbGFzaGNhcmRzW2R1ZU9mZnNldF0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGR1ZURhdGVzRmxhc2hjYXJkc0NvcHk6IFJlY29yZDxudW1iZXIsIG51bWJlcj4gPSB7IDA6IDAgfTtcbiAgICAgICAgZm9yIChsZXQgW2R1ZU9mZnNldCwgZHVlQ291bnRdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuZHVlRGF0ZXNGbGFzaGNhcmRzKSkge1xuICAgICAgICAgICAgaWYgKGR1ZU9mZnNldCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZXNGbGFzaGNhcmRzQ29weVswXSArPSBkdWVDb3VudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZXNGbGFzaGNhcmRzQ29weVtkdWVPZmZzZXRdID0gZHVlQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGV4dDogc3RyaW5nID1cbiAgICAgICAgICAgIFwiYGBgY2hhcnRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHR5cGU6IGJhclxcblwiICtcbiAgICAgICAgICAgIGBcXHRsYWJlbHM6IFske09iamVjdC5rZXlzKGR1ZURhdGVzRmxhc2hjYXJkc0NvcHkpfV1cXG5gICtcbiAgICAgICAgICAgIFwiXFx0c2VyaWVzOlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0LSB0aXRsZTogXCIgK1xuICAgICAgICAgICAgdChcIlNjaGVkdWxlZFwiKSArXG4gICAgICAgICAgICBgXFxuXFx0XFx0ICBkYXRhOiBbJHtPYmplY3QudmFsdWVzKGR1ZURhdGVzRmxhc2hjYXJkc0NvcHkpfV1cXG5gICtcbiAgICAgICAgICAgIFwiXFx0eFRpdGxlOiBcIiArXG4gICAgICAgICAgICB0KFwiRGF5c1wiKSArXG4gICAgICAgICAgICBcIlxcblxcdHlUaXRsZTogXCIgK1xuICAgICAgICAgICAgdChcIk51bWJlciBvZiBjYXJkc1wiKSArXG4gICAgICAgICAgICBcIlxcblxcdGxlZ2VuZDogZmFsc2VcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHN0YWNrZWQ6IHRydWVcXG5cIiArXG4gICAgICAgICAgICBcImBgYGBcIjtcblxuICAgICAgICBNYXJrZG93blJlbmRlcmVyLnJlbmRlck1hcmtkb3duKHRleHQsIGNvbnRlbnRFbCwgXCJcIiwgdGhpcy5wbHVnaW4pO1xuICAgIH1cblxuICAgIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgICAgIGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICAgICAgY29udGVudEVsLmVtcHR5KCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIE1lbnUsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB0eXBlIFNSUGx1Z2luIGZyb20gXCJzcmMvbWFpblwiO1xuaW1wb3J0IHsgQ09MTEFQU0VfSUNPTiB9IGZyb20gXCJzcmMvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBSZXZpZXdEZWNrIH0gZnJvbSBcInNyYy9yZXZpZXctZGVja1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9oZWxwZXJzXCI7XG5cbmV4cG9ydCBjb25zdCBSRVZJRVdfUVVFVUVfVklFV19UWVBFOiBzdHJpbmcgPSBcInJldmlldy1xdWV1ZS1saXN0LXZpZXdcIjtcblxuZXhwb3J0IGNsYXNzIFJldmlld1F1ZXVlTGlzdFZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gICAgcHJpdmF0ZSBwbHVnaW46IFNSUGx1Z2luO1xuXG4gICAgY29uc3RydWN0b3IobGVhZjogV29ya3NwYWNlTGVhZiwgcGx1Z2luOiBTUlBsdWdpbikge1xuICAgICAgICBzdXBlcihsZWFmKTtcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtb3BlblwiLCAoXzogYW55KSA9PiB0aGlzLnJlZHJhdygpKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC52YXVsdC5vbihcInJlbmFtZVwiLCAoXzogYW55KSA9PiB0aGlzLnJlZHJhdygpKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBSRVZJRVdfUVVFVUVfVklFV19UWVBFO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdChcIk5vdGVzIFJldmlldyBRdWV1ZVwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0SWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJjcm9zc2hhaXJzXCI7XG4gICAgfVxuXG4gICAgcHVibGljIG9uSGVhZGVyTWVudShtZW51OiBNZW51KTogdm9pZCB7XG4gICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaXRlbS5zZXRUaXRsZSh0KFwiQ2xvc2VcIikpXG4gICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc1wiKVxuICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShSRVZJRVdfUVVFVUVfVklFV19UWVBFKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZHJhdygpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9wZW5GaWxlOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXG4gICAgICAgIGxldCByb290RWw6IEhUTUxFbGVtZW50ID0gY3JlYXRlRGl2KFwibmF2LWZvbGRlciBtb2Qtcm9vdFwiKSxcbiAgICAgICAgICAgIGNoaWxkcmVuRWw6IEhUTUxFbGVtZW50ID0gcm9vdEVsLmNyZWF0ZURpdihcIm5hdi1mb2xkZXItY2hpbGRyZW5cIik7XG5cbiAgICAgICAgZm9yIChsZXQgZGVja0tleSBpbiB0aGlzLnBsdWdpbi5yZXZpZXdEZWNrcykge1xuICAgICAgICAgICAgbGV0IGRlY2s6IFJldmlld0RlY2sgPSB0aGlzLnBsdWdpbi5yZXZpZXdEZWNrc1tkZWNrS2V5XTtcblxuICAgICAgICAgICAgbGV0IGRlY2tGb2xkZXJFbDogSFRNTEVsZW1lbnQgPSB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZvbGRlcihcbiAgICAgICAgICAgICAgICBjaGlsZHJlbkVsLFxuICAgICAgICAgICAgICAgIGRlY2tLZXksXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVja1xuICAgICAgICAgICAgKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmF2LWZvbGRlci1jaGlsZHJlblwiKVswXSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKGRlY2submV3Tm90ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBuZXdOb3Rlc0ZvbGRlckVsOiBIVE1MRWxlbWVudCA9IHRoaXMuY3JlYXRlUmlnaHRQYW5lRm9sZGVyKFxuICAgICAgICAgICAgICAgICAgICBkZWNrRm9sZGVyRWwsXG4gICAgICAgICAgICAgICAgICAgIHQoXCJOZXdcIiksXG4gICAgICAgICAgICAgICAgICAgICFkZWNrLmFjdGl2ZUZvbGRlcnMuaGFzKHQoXCJOZXdcIikpLFxuICAgICAgICAgICAgICAgICAgICBkZWNrXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IG5ld0ZpbGUgb2YgZGVjay5uZXdOb3Rlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdOb3Rlc0ZvbGRlckVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5GaWxlISAmJiBuZXdGaWxlLnBhdGggPT09IG9wZW5GaWxlLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAhZGVjay5hY3RpdmVGb2xkZXJzLmhhcyh0KFwiTmV3XCIpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRlY2suc2NoZWR1bGVkTm90ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBub3c6IG51bWJlciA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJVbml4OiBudW1iZXIgPSAtMTtcbiAgICAgICAgICAgICAgICBsZXQgc2NoZWRGb2xkZXJFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyVGl0bGU6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgbGV0IG1heERheXNUb1JlbmRlcjogbnVtYmVyID0gdGhpcy5wbHVnaW4uZGF0YS5zZXR0aW5ncy5tYXhORGF5c05vdGVzUmV2aWV3UXVldWU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzTm90ZSBvZiBkZWNrLnNjaGVkdWxlZE5vdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzTm90ZS5kdWVVbml4ICE9IGN1cnJVbml4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbkRheXM6IG51bWJlciA9IE1hdGguY2VpbCgoc05vdGUuZHVlVW5peCAtIG5vdykgLyAoMjQgKiAzNjAwICogMTAwMCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobkRheXMgPiBtYXhEYXlzVG9SZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyVGl0bGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5EYXlzID09IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdChcIlllc3RlcmRheVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5EYXlzID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0KFwiVG9kYXlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuRGF5cyA9PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdChcIlRvbW9ycm93XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV3IERhdGUoc05vdGUuZHVlVW5peCkudG9EYXRlU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkRm9sZGVyRWwgPSB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZvbGRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNrRm9sZGVyRWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyVGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIWRlY2suYWN0aXZlRm9sZGVycy5oYXMoZm9sZGVyVGl0bGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyVW5peCA9IHNOb3RlLmR1ZVVuaXg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJpZ2h0UGFuZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2hlZEZvbGRlckVsISxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNOb3RlLm5vdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuRmlsZSEgJiYgc05vdGUubm90ZS5wYXRoID09PSBvcGVuRmlsZS5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgIWRlY2suYWN0aXZlRm9sZGVycy5oYXMoZm9sZGVyVGl0bGUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNvbnRlbnRFbDogRWxlbWVudCA9IHRoaXMuY29udGFpbmVyRWwuY2hpbGRyZW5bMV07XG4gICAgICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICAgICAgICBjb250ZW50RWwuYXBwZW5kQ2hpbGQocm9vdEVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVJpZ2h0UGFuZUZvbGRlcihcbiAgICAgICAgcGFyZW50RWw6IEhUTUxFbGVtZW50LFxuICAgICAgICBmb2xkZXJUaXRsZTogc3RyaW5nLFxuICAgICAgICBjb2xsYXBzZWQ6IGJvb2xlYW4sXG4gICAgICAgIGRlY2s6IFJldmlld0RlY2tcbiAgICApOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIGxldCBmb2xkZXJFbDogSFRNTERpdkVsZW1lbnQgPSBwYXJlbnRFbC5jcmVhdGVEaXYoXCJuYXYtZm9sZGVyXCIpLFxuICAgICAgICAgICAgZm9sZGVyVGl0bGVFbDogSFRNTERpdkVsZW1lbnQgPSBmb2xkZXJFbC5jcmVhdGVEaXYoXCJuYXYtZm9sZGVyLXRpdGxlXCIpLFxuICAgICAgICAgICAgY2hpbGRyZW5FbDogSFRNTERpdkVsZW1lbnQgPSBmb2xkZXJFbC5jcmVhdGVEaXYoXCJuYXYtZm9sZGVyLWNoaWxkcmVuXCIpLFxuICAgICAgICAgICAgY29sbGFwc2VJY29uRWw6IEhUTUxEaXZFbGVtZW50ID0gZm9sZGVyVGl0bGVFbC5jcmVhdGVEaXYoXG4gICAgICAgICAgICAgICAgXCJuYXYtZm9sZGVyLWNvbGxhcHNlLWluZGljYXRvciBjb2xsYXBzZS1pY29uXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgY29sbGFwc2VJY29uRWwuaW5uZXJIVE1MID0gQ09MTEFQU0VfSUNPTjtcbiAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgICAgKGNvbGxhcHNlSWNvbkVsLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zZm9ybSA9IFwicm90YXRlKC05MGRlZylcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvbGRlclRpdGxlRWwuY3JlYXRlRGl2KFwibmF2LWZvbGRlci10aXRsZS1jb250ZW50XCIpLnNldFRleHQoZm9sZGVyVGl0bGUpO1xuXG4gICAgICAgIGZvbGRlclRpdGxlRWwub25DbGlja0V2ZW50KChfKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbkVsLmNoaWxkTm9kZXMgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQuc3R5bGUuZGlzcGxheSA9PT0gXCJibG9ja1wiIHx8IGNoaWxkLnN0eWxlLmRpc3BsYXkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICAoY29sbGFwc2VJY29uRWwuY2hpbGROb2Rlc1swXSBhcyBIVE1MRWxlbWVudCkuc3R5bGUudHJhbnNmb3JtID1cbiAgICAgICAgICAgICAgICAgICAgICAgIFwicm90YXRlKC05MGRlZylcIjtcbiAgICAgICAgICAgICAgICAgICAgZGVjay5hY3RpdmVGb2xkZXJzLmRlbGV0ZShmb2xkZXJUaXRsZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgKGNvbGxhcHNlSWNvbkVsLmNoaWxkTm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQpLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGRlY2suYWN0aXZlRm9sZGVycy5hZGQoZm9sZGVyVGl0bGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvbGRlckVsO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUmlnaHRQYW5lRmlsZShcbiAgICAgICAgZm9sZGVyRWw6IEhUTUxFbGVtZW50LFxuICAgICAgICBmaWxlOiBURmlsZSxcbiAgICAgICAgZmlsZUVsQWN0aXZlOiBib29sZWFuLFxuICAgICAgICBoaWRkZW46IGJvb2xlYW5cbiAgICApOiB2b2lkIHtcbiAgICAgICAgbGV0IG5hdkZpbGVFbDogSFRNTEVsZW1lbnQgPSBmb2xkZXJFbFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYXYtZm9sZGVyLWNoaWxkcmVuXCIpWzBdXG4gICAgICAgICAgICAuY3JlYXRlRGl2KFwibmF2LWZpbGVcIik7XG4gICAgICAgIGlmIChoaWRkZW4pIHtcbiAgICAgICAgICAgIG5hdkZpbGVFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmF2RmlsZVRpdGxlOiBIVE1MRWxlbWVudCA9IG5hdkZpbGVFbC5jcmVhdGVEaXYoXCJuYXYtZmlsZS10aXRsZVwiKTtcbiAgICAgICAgaWYgKGZpbGVFbEFjdGl2ZSkge1xuICAgICAgICAgICAgbmF2RmlsZVRpdGxlLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmF2RmlsZVRpdGxlLmNyZWF0ZURpdihcIm5hdi1maWxlLXRpdGxlLWNvbnRlbnRcIikuc2V0VGV4dChmaWxlLmJhc2VuYW1lKTtcbiAgICAgICAgbmF2RmlsZVRpdGxlLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLm9wZW5GaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIG5hdkZpbGVUaXRsZS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjb250ZXh0bWVudVwiLFxuICAgICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZU1lbnU6IE1lbnUgPSBuZXcgTWVudSh0aGlzLmFwcCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnRyaWdnZXIoXCJmaWxlLW1lbnVcIiwgZmlsZU1lbnUsIGZpbGUsIFwibXktY29udGV4dC1tZW51XCIsIG51bGwpO1xuICAgICAgICAgICAgICAgIGZpbGVNZW51LnNob3dBdFBvc2l0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgeDogZXZlbnQucGFnZVgsXG4gICAgICAgICAgICAgICAgICAgIHk6IGV2ZW50LnBhZ2VZLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgRnV6enlTdWdnZXN0TW9kYWwsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IFNjaGVkTm90ZSB9IGZyb20gXCJzcmMvbWFpblwiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9oZWxwZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBSZXZpZXdEZWNrIHtcbiAgICBwdWJsaWMgZGVja05hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgbmV3Tm90ZXM6IFRGaWxlW10gPSBbXTtcbiAgICBwdWJsaWMgc2NoZWR1bGVkTm90ZXM6IFNjaGVkTm90ZVtdID0gW107XG4gICAgcHVibGljIGFjdGl2ZUZvbGRlcnM6IFNldDxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZGVja05hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmFjdGl2ZUZvbGRlcnMgPSBuZXcgU2V0KFt0KFwiVG9kYXlcIildKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc29ydE5vdGVzKHBhZ2VyYW5rczogUmVjb3JkPHN0cmluZywgbnVtYmVyPikge1xuICAgICAgICB0aGlzLm5ld05vdGVzID0gdGhpcy5uZXdOb3Rlcy5zb3J0KFxuICAgICAgICAgICAgKGE6IFRGaWxlLCBiOiBURmlsZSkgPT4gKHBhZ2VyYW5rc1tiLnBhdGhdIHx8IDApIC0gKHBhZ2VyYW5rc1thLnBhdGhdIHx8IDApXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gc29ydCBzY2hlZHVsZWQgbm90ZXMgYnkgZGF0ZSAmIHdpdGhpbiB0aG9zZSBkYXlzLCBzb3J0IHRoZW0gYnkgaW1wb3J0YW5jZVxuICAgICAgICB0aGlzLnNjaGVkdWxlZE5vdGVzID0gdGhpcy5zY2hlZHVsZWROb3Rlcy5zb3J0KChhOiBTY2hlZE5vdGUsIGI6IFNjaGVkTm90ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGEuZHVlVW5peCAtIGIuZHVlVW5peDtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHBhZ2VyYW5rc1tiLm5vdGUucGF0aF0gfHwgMCkgLSAocGFnZXJhbmtzW2Eubm90ZS5wYXRoXSB8fCAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmV2aWV3RGVja1NlbGVjdGlvbk1vZGFsIGV4dGVuZHMgRnV6enlTdWdnZXN0TW9kYWw8c3RyaW5nPiB7XG4gICAgcHVibGljIGRlY2tLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHB1YmxpYyBzdWJtaXRDYWxsYmFjazogKGRlY2tLZXk6IHN0cmluZykgPT4gdm9pZDtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBkZWNrS2V5czogc3RyaW5nW10pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5kZWNrS2V5cyA9IGRlY2tLZXlzO1xuICAgIH1cblxuICAgIGdldEl0ZW1zKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVja0tleXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgb25DaG9vc2VJdGVtKGRlY2tLZXk6IHN0cmluZywgXzogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLnN1Ym1pdENhbGxiYWNrKGRlY2tLZXkpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENhcmRUeXBlIH0gZnJvbSBcInNyYy90eXBlc1wiO1xuXG4vKipcbiAqIFJldHVybnMgZmxhc2hjYXJkcyBmb3VuZCBpbiBgdGV4dGBcbiAqXG4gKiBAcGFyYW0gdGV4dCAtIFRoZSB0ZXh0IHRvIGV4dHJhY3QgZmxhc2hjYXJkcyBmcm9tXG4gKiBAcGFyYW0gc2luZ2xlbGluZUNhcmRTZXBhcmF0b3IgLSBTZXBhcmF0b3IgZm9yIGlubGluZSBiYXNpYyBjYXJkc1xuICogQHBhcmFtIHNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IgLSBTZXBhcmF0b3IgZm9yIGlubGluZSByZXZlcnNlZCBjYXJkc1xuICogQHBhcmFtIG11bHRpbGluZUNhcmRTZXBhcmF0b3IgLSBTZXBhcmF0b3IgZm9yIG11bHRpbGluZSBiYXNpYyBjYXJkc1xuICogQHBhcmFtIG11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvciAtIFNlcGFyYXRvciBmb3IgbXVsdGlsaW5lIGJhc2ljIGNhcmRcbiAqIEByZXR1cm5zIEFuIGFycmF5IG9mIFtDYXJkVHlwZSwgY2FyZCB0ZXh0LCBsaW5lIG51bWJlcl0gdHVwbGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgc2luZ2xlbGluZUNhcmRTZXBhcmF0b3I6IHN0cmluZyxcbiAgICBzaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yOiBzdHJpbmcsXG4gICAgbXVsdGlsaW5lQ2FyZFNlcGFyYXRvcjogc3RyaW5nLFxuICAgIG11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcjogc3RyaW5nXG4pOiBbQ2FyZFR5cGUsIHN0cmluZywgbnVtYmVyXVtdIHtcbiAgICBsZXQgY2FyZFRleHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgbGV0IGNhcmRzOiBbQ2FyZFR5cGUsIHN0cmluZywgbnVtYmVyXVtdID0gW107XG4gICAgbGV0IGNhcmRUeXBlOiBDYXJkVHlwZSB8IG51bGwgPSBudWxsO1xuICAgIGxldCBsaW5lTm86IG51bWJlciA9IDA7XG5cbiAgICBsZXQgbGluZXM6IHN0cmluZ1tdID0gdGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChsaW5lc1tpXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChjYXJkVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhcmRzLnB1c2goW2NhcmRUeXBlLCBjYXJkVGV4dCwgbGluZU5vXSk7XG4gICAgICAgICAgICAgICAgY2FyZFR5cGUgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXJkVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChsaW5lc1tpXS5zdGFydHNXaXRoKFwiPCEtLVwiKSAmJiAhbGluZXNbaV0uc3RhcnRzV2l0aChcIjwhLS1TUjpcIikpIHtcbiAgICAgICAgICAgIHdoaWxlIChpICsgMSA8IGxpbmVzLmxlbmd0aCAmJiAhbGluZXNbaSArIDFdLmluY2x1ZGVzKFwiLS0+XCIpKSBpKys7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYXJkVGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjYXJkVGV4dCArPSBcIlxcblwiO1xuICAgICAgICB9XG4gICAgICAgIGNhcmRUZXh0ICs9IGxpbmVzW2ldO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGxpbmVzW2ldLmluY2x1ZGVzKHNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IpIHx8XG4gICAgICAgICAgICBsaW5lc1tpXS5pbmNsdWRlcyhzaW5nbGVsaW5lQ2FyZFNlcGFyYXRvcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjYXJkVHlwZSA9IGxpbmVzW2ldLmluY2x1ZGVzKHNpbmdsZWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IpXG4gICAgICAgICAgICAgICAgPyBDYXJkVHlwZS5TaW5nbGVMaW5lUmV2ZXJzZWRcbiAgICAgICAgICAgICAgICA6IENhcmRUeXBlLlNpbmdsZUxpbmVCYXNpYztcbiAgICAgICAgICAgIGNhcmRUZXh0ID0gbGluZXNbaV07XG4gICAgICAgICAgICBsaW5lTm8gPSBpO1xuICAgICAgICAgICAgaWYgKGkgKyAxIDwgbGluZXMubGVuZ3RoICYmIGxpbmVzW2kgKyAxXS5zdGFydHNXaXRoKFwiPCEtLVNSOlwiKSkge1xuICAgICAgICAgICAgICAgIGNhcmRUZXh0ICs9IFwiXFxuXCIgKyBsaW5lc1tpICsgMV07XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FyZHMucHVzaChbY2FyZFR5cGUsIGNhcmRUZXh0LCBsaW5lTm9dKTtcbiAgICAgICAgICAgIGNhcmRUeXBlID0gbnVsbDtcbiAgICAgICAgICAgIGNhcmRUZXh0ID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gbnVsbCAmJiAvPT0uKj89PS9nbS50ZXN0KGxpbmVzW2ldKSkge1xuICAgICAgICAgICAgY2FyZFR5cGUgPSBDYXJkVHlwZS5DbG96ZTtcbiAgICAgICAgICAgIGxpbmVObyA9IGk7XG4gICAgICAgIH0gZWxzZSBpZiAobGluZXNbaV0gPT09IG11bHRpbGluZUNhcmRTZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIGNhcmRUeXBlID0gQ2FyZFR5cGUuTXVsdGlMaW5lQmFzaWM7XG4gICAgICAgICAgICBsaW5lTm8gPSBpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpbmVzW2ldID09PSBtdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIGNhcmRUeXBlID0gQ2FyZFR5cGUuTXVsdGlMaW5lUmV2ZXJzZWQ7XG4gICAgICAgICAgICBsaW5lTm8gPSBpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpbmVzW2ldLnN0YXJ0c1dpdGgoXCJgYGBcIikpIHtcbiAgICAgICAgICAgIHdoaWxlIChpICsgMSA8IGxpbmVzLmxlbmd0aCAmJiAhbGluZXNbaSArIDFdLnN0YXJ0c1dpdGgoXCJgYGBcIikpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY2FyZFRleHQgKz0gXCJcXG5cIiArIGxpbmVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FyZFRleHQgKz0gXCJcXG5cIiArIFwiYGBgXCI7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FyZFR5cGUgJiYgY2FyZFRleHQpIHtcbiAgICAgICAgY2FyZHMucHVzaChbY2FyZFR5cGUsIGNhcmRUZXh0LCBsaW5lTm9dKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FyZHM7XG59XG4iLCJpbXBvcnQgeyBOb3RpY2UsIFBsdWdpbiwgYWRkSWNvbiwgVEFic3RyYWN0RmlsZSwgVEZpbGUsIEhlYWRpbmdDYWNoZSwgZ2V0QWxsVGFncyB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgKiBhcyBncmFwaCBmcm9tIFwicGFnZXJhbmsuanNcIjtcclxuXHJcbmltcG9ydCB7IFNSU2V0dGluZ1RhYiwgU1JTZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgRmxhc2hjYXJkTW9kYWwsIERlY2sgfSBmcm9tIFwic3JjL2ZsYXNoY2FyZC1tb2RhbFwiO1xyXG5pbXBvcnQgeyBTdGF0c01vZGFsIH0gZnJvbSBcInNyYy9zdGF0cy1tb2RhbFwiO1xyXG5pbXBvcnQgeyBSZXZpZXdRdWV1ZUxpc3RWaWV3LCBSRVZJRVdfUVVFVUVfVklFV19UWVBFIH0gZnJvbSBcInNyYy9zaWRlYmFyXCI7XHJcbmltcG9ydCB7IENhcmQsIFJldmlld1Jlc3BvbnNlLCBzY2hlZHVsZSB9IGZyb20gXCJzcmMvc2NoZWR1bGluZ1wiO1xyXG5pbXBvcnQgeyBDYXJkVHlwZSB9IGZyb20gXCJzcmMvdHlwZXNcIjtcclxuaW1wb3J0IHtcclxuICAgIENST1NTX0hBSVJTX0lDT04sXHJcbiAgICBZQU1MX0ZST05UX01BVFRFUl9SRUdFWCxcclxuICAgIFNDSEVEVUxJTkdfSU5GT19SRUdFWCxcclxuICAgIExFR0FDWV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUixcclxuICAgIE1VTFRJX1NDSEVEVUxJTkdfRVhUUkFDVE9SLFxyXG59IGZyb20gXCJzcmMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGVzY2FwZVJlZ2V4U3RyaW5nLCBjeXJiNTMgfSBmcm9tIFwic3JjL3V0aWxzXCI7XHJcbmltcG9ydCB7IFJldmlld0RlY2ssIFJldmlld0RlY2tTZWxlY3Rpb25Nb2RhbCB9IGZyb20gXCJzcmMvcmV2aWV3LWRlY2tcIjtcclxuaW1wb3J0IHsgdCB9IGZyb20gXCJzcmMvbGFuZy9oZWxwZXJzXCI7XHJcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSBcInNyYy9wYXJzZXJcIjtcclxuaW1wb3J0IHsgTG9nZ2VyLCBjcmVhdGVMb2dnZXIgfSBmcm9tIFwic3JjL2xvZ2dlclwiO1xyXG5cclxuaW50ZXJmYWNlIFBsdWdpbkRhdGEge1xyXG4gICAgc2V0dGluZ3M6IFNSU2V0dGluZ3M7XHJcbiAgICBidXJ5RGF0ZTogc3RyaW5nO1xyXG4gICAgLy8gaGFzaGVzIG9mIGNhcmQgdGV4dHNcclxuICAgIC8vIHNob3VsZCB3b3JrIGFzIGxvbmcgYXMgdXNlciBkb2Vzbid0IG1vZGlmeSBjYXJkJ3MgdGV4dFxyXG4gICAgLy8gd2hpY2ggY292ZXJzIG1vc3Qgb2YgdGhlIGNhc2VzXHJcbiAgICBidXJ5TGlzdDogc3RyaW5nW107XHJcbiAgICBjYWNoZTogUmVjb3JkPHN0cmluZywgU1JGaWxlQ2FjaGU+OyAvLyBSZWNvcmQ8bGFzdCBrbm93biBwYXRoLCBTUkZpbGVDYWNoZT5cclxufVxyXG5cclxuY29uc3QgREVGQVVMVF9EQVRBOiBQbHVnaW5EYXRhID0ge1xyXG4gICAgc2V0dGluZ3M6IERFRkFVTFRfU0VUVElOR1MsXHJcbiAgICBidXJ5RGF0ZTogXCJcIixcclxuICAgIGJ1cnlMaXN0OiBbXSxcclxuICAgIGNhY2hlOiB7fSxcclxufTtcclxuXHJcbmludGVyZmFjZSBTUkZpbGVDYWNoZSB7XHJcbiAgICB0b3RhbENhcmRzOiBudW1iZXI7XHJcbiAgICBoYXNOZXdDYXJkczogYm9vbGVhbjtcclxuICAgIG5leHREdWVEYXRlOiBzdHJpbmc7XHJcbiAgICBsYXN0VXBkYXRlZDogbnVtYmVyO1xyXG4gICAgZHVlRGF0ZXNGbGFzaGNhcmRzOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVkTm90ZSB7XHJcbiAgICBub3RlOiBURmlsZTtcclxuICAgIGR1ZVVuaXg6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMaW5rU3RhdCB7XHJcbiAgICBzb3VyY2VQYXRoOiBzdHJpbmc7XHJcbiAgICBsaW5rQ291bnQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU1JQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG4gICAgcHJpdmF0ZSBzdGF0dXNCYXI6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZXZpZXdRdWV1ZVZpZXc6IFJldmlld1F1ZXVlTGlzdFZpZXc7XHJcbiAgICBwdWJsaWMgZGF0YTogUGx1Z2luRGF0YTtcclxuICAgIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcclxuXHJcbiAgICBwdWJsaWMgcmV2aWV3RGVja3M6IHsgW2RlY2tLZXk6IHN0cmluZ106IFJldmlld0RlY2sgfSA9IHt9O1xyXG4gICAgcHVibGljIGxhc3RTZWxlY3RlZFJldmlld0RlY2s6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgbmV3Tm90ZXM6IFRGaWxlW10gPSBbXTtcclxuICAgIHB1YmxpYyBzY2hlZHVsZWROb3RlczogU2NoZWROb3RlW10gPSBbXTtcclxuICAgIHByaXZhdGUgZWFzZUJ5UGF0aDogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBpbmNvbWluZ0xpbmtzOiBSZWNvcmQ8c3RyaW5nLCBMaW5rU3RhdFtdPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwYWdlcmFua3M6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcclxuICAgIHByaXZhdGUgZHVlTm90ZXNDb3VudDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBkdWVEYXRlc05vdGVzOiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+ID0ge307IC8vIFJlY29yZDwjIG9mIGRheXMgaW4gZnV0dXJlLCBkdWUgY291bnQ+XHJcblxyXG4gICAgcHVibGljIGRlY2tUcmVlOiBEZWNrID0gbmV3IERlY2soXCJyb290XCIsIG51bGwpO1xyXG4gICAgcHVibGljIGR1ZURhdGVzRmxhc2hjYXJkczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9OyAvLyBSZWNvcmQ8IyBvZiBkYXlzIGluIGZ1dHVyZSwgZHVlIGNvdW50PlxyXG5cclxuICAgIC8vIHByZXZlbnQgY2FsbGluZyB0aGVzZSBmdW5jdGlvbnMgaWYgYW5vdGhlciBpbnN0YW5jZSBpcyBhbHJlYWR5IHJ1bm5pbmdcclxuICAgIHByaXZhdGUgbm90ZXNTeW5jTG9jazogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBmbGFzaGNhcmRzU3luY0xvY2s6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkUGx1Z2luRGF0YSgpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gY3JlYXRlTG9nZ2VyKGNvbnNvbGUsIHRoaXMuZGF0YS5zZXR0aW5ncy5sb2dMZXZlbCk7XHJcblxyXG4gICAgICAgIGFkZEljb24oXCJjcm9zc2hhaXJzXCIsIENST1NTX0hBSVJTX0lDT04pO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXR1c0JhciA9IHRoaXMuYWRkU3RhdHVzQmFySXRlbSgpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLmNsYXNzTGlzdC5hZGQoXCJtb2QtY2xpY2thYmxlXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgdChcIk9wZW4gYSBub3RlIGZvciByZXZpZXdcIikpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWwtcG9zaXRpb25cIiwgXCJ0b3BcIik7XHJcbiAgICAgICAgdGhpcy5zdGF0dXNCYXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChfOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm5vdGVzU3luY0xvY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3luYygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXZpZXdOZXh0Tm90ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRSaWJib25JY29uKFwiY3Jvc3NoYWlyc1wiLCB0KFwiUmV2aWV3IGZsYXNoY2FyZHNcIiksIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmZsYXNoY2FyZHNTeW5jTG9jaykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5mbGFzaGNhcmRzX3N5bmMoKTtcclxuICAgICAgICAgICAgICAgIG5ldyBGbGFzaGNhcmRNb2RhbCh0aGlzLmFwcCwgdGhpcykub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJWaWV3KFxyXG4gICAgICAgICAgICBSRVZJRVdfUVVFVUVfVklFV19UWVBFLFxyXG4gICAgICAgICAgICAobGVhZikgPT4gKHRoaXMucmV2aWV3UXVldWVWaWV3ID0gbmV3IFJldmlld1F1ZXVlTGlzdFZpZXcobGVhZiwgdGhpcykpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRhdGEuc2V0dGluZ3MuZGlzYWJsZUZpbGVNZW51UmV2aWV3T3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJmaWxlLW1lbnVcIiwgKG1lbnUsIGZpbGVpc2g6IFRBYnN0cmFjdEZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZWlzaCBpbnN0YW5jZW9mIFRGaWxlICYmIGZpbGVpc2guZXh0ZW5zaW9uID09PSBcIm1kXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHQoXCJSZXZpZXc6IEVhc3lcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc2hhaXJzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKF8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmV2aWV3UmVzcG9uc2UoZmlsZWlzaCwgUmV2aWV3UmVzcG9uc2UuRWFzeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHQoXCJSZXZpZXc6IEdvb2RcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc2hhaXJzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKF8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmV2aWV3UmVzcG9uc2UoZmlsZWlzaCwgUmV2aWV3UmVzcG9uc2UuR29vZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHQoXCJSZXZpZXc6IEhhcmRcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJjcm9zc2hhaXJzXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKF8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmV2aWV3UmVzcG9uc2UoZmlsZWlzaCwgUmV2aWV3UmVzcG9uc2UuSGFyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogXCJzcnMtbm90ZS1yZXZpZXctb3Blbi1ub3RlXCIsXHJcbiAgICAgICAgICAgIG5hbWU6IHQoXCJPcGVuIGEgbm90ZSBmb3IgcmV2aWV3XCIpLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm5vdGVzU3luY0xvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJldmlld05leHROb3RlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6IFwic3JzLW5vdGUtcmV2aWV3LWVhc3lcIixcclxuICAgICAgICAgICAgbmFtZTogdChcIlJldmlldyBub3RlIGFzIGVhc3lcIiksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcGVuRmlsZTogVEZpbGUgfCBudWxsID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVuRmlsZSAmJiBvcGVuRmlsZS5leHRlbnNpb24gPT09IFwibWRcIilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVSZXZpZXdSZXNwb25zZShvcGVuRmlsZSwgUmV2aWV3UmVzcG9uc2UuRWFzeSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgICAgICAgIGlkOiBcInNycy1ub3RlLXJldmlldy1nb29kXCIsXHJcbiAgICAgICAgICAgIG5hbWU6IHQoXCJSZXZpZXcgbm90ZSBhcyBnb29kXCIpLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlbkZpbGU6IFRGaWxlIHwgbnVsbCA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlbkZpbGUgJiYgb3BlbkZpbGUuZXh0ZW5zaW9uID09PSBcIm1kXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlUmV2aWV3UmVzcG9uc2Uob3BlbkZpbGUsIFJldmlld1Jlc3BvbnNlLkdvb2QpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogXCJzcnMtbm90ZS1yZXZpZXctaGFyZFwiLFxyXG4gICAgICAgICAgICBuYW1lOiB0KFwiUmV2aWV3IG5vdGUgYXMgaGFyZFwiKSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wZW5GaWxlOiBURmlsZSB8IG51bGwgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZW5GaWxlICYmIG9wZW5GaWxlLmV4dGVuc2lvbiA9PT0gXCJtZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVJldmlld1Jlc3BvbnNlKG9wZW5GaWxlLCBSZXZpZXdSZXNwb25zZS5IYXJkKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6IFwic3JzLXJldmlldy1mbGFzaGNhcmRzXCIsXHJcbiAgICAgICAgICAgIG5hbWU6IHQoXCJSZXZpZXcgZmxhc2hjYXJkc1wiKSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5mbGFzaGNhcmRzU3luY0xvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZsYXNoY2FyZHNfc3luYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBGbGFzaGNhcmRNb2RhbCh0aGlzLmFwcCwgdGhpcykub3BlbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogXCJzcnMtdmlldy1zdGF0c1wiLFxyXG4gICAgICAgICAgICBuYW1lOiB0KFwiVmlldyBzdGF0aXN0aWNzXCIpLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmZsYXNoY2FyZHNTeW5jTG9jaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmxhc2hjYXJkc19zeW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0YXRzTW9kYWwodGhpcy5hcHAsIHRoaXMuZHVlRGF0ZXNGbGFzaGNhcmRzLCB0aGlzKS5vcGVuKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU1JTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmlldygpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc3luYygpLCAyMDAwKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmZsYXNoY2FyZHNfc3luYygpLCAyMDAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbnVubG9hZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKFJFVklFV19RVUVVRV9WSUVXX1RZUEUpLmZvckVhY2goKGxlYWYpID0+IGxlYWYuZGV0YWNoKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHN5bmMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgaWYgKHRoaXMubm90ZXNTeW5jTG9jaykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm90ZXNTeW5jTG9jayA9IHRydWU7XHJcblxyXG4gICAgICAgIGxldCBub3RlczogVEZpbGVbXSA9IHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcclxuXHJcbiAgICAgICAgZ3JhcGgucmVzZXQoKTtcclxuICAgICAgICB0aGlzLnNjaGVkdWxlZE5vdGVzID0gW107XHJcbiAgICAgICAgdGhpcy5lYXNlQnlQYXRoID0ge307XHJcbiAgICAgICAgdGhpcy5uZXdOb3RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5jb21pbmdMaW5rcyA9IHt9O1xyXG4gICAgICAgIHRoaXMucGFnZXJhbmtzID0ge307XHJcbiAgICAgICAgdGhpcy5kdWVOb3Rlc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmR1ZURhdGVzTm90ZXMgPSB7fTtcclxuICAgICAgICB0aGlzLnJldmlld0RlY2tzID0ge307XHJcblxyXG4gICAgICAgIGxldCBub3c6IG51bWJlciA9IERhdGUubm93KCk7XHJcbiAgICAgICAgZm9yIChsZXQgbm90ZSBvZiBub3Rlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbmNvbWluZ0xpbmtzW25vdGUucGF0aF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvbWluZ0xpbmtzW25vdGUucGF0aF0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGxpbmtzID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5yZXNvbHZlZExpbmtzW25vdGUucGF0aF0gfHwge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IHRhcmdldFBhdGggaW4gbGlua3MpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluY29taW5nTGlua3NbdGFyZ2V0UGF0aF0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluY29taW5nTGlua3NbdGFyZ2V0UGF0aF0gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYXJrZG93biBmaWxlcyBvbmx5XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0UGF0aC5zcGxpdChcIi5cIikucG9wKCkhLnRvTG93ZXJDYXNlKCkgPT09IFwibWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5jb21pbmdMaW5rc1t0YXJnZXRQYXRoXS5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlUGF0aDogbm90ZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rQ291bnQ6IGxpbmtzW3RhcmdldFBhdGhdLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBncmFwaC5saW5rKG5vdGUucGF0aCwgdGFyZ2V0UGF0aCwgbGlua3NbdGFyZ2V0UGF0aF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5ub3RlRm9sZGVyc1RvSWdub3JlLnNvbWUoKGZvbGRlcikgPT5cclxuICAgICAgICAgICAgICAgICAgICBub3RlLnBhdGguc3RhcnRzV2l0aChmb2xkZXIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBmaWxlQ2FjaGVkRGF0YSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKG5vdGUpIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgbGV0IGZyb250bWF0dGVyID0gZmlsZUNhY2hlZERhdGEuZnJvbnRtYXR0ZXIgfHwgPFJlY29yZDxzdHJpbmcsIGFueT4+e307XHJcbiAgICAgICAgICAgIGxldCB0YWdzID0gZ2V0QWxsVGFncyhmaWxlQ2FjaGVkRGF0YSkgfHwgW107XHJcblxyXG4gICAgICAgICAgICBsZXQgc2hvdWxkSWdub3JlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yIChsZXQgdGFnIG9mIHRhZ3MpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3MudGFnc1RvUmV2aWV3LnNvbWUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0YWdUb1JldmlldykgPT4gdGFnID09PSB0YWdUb1JldmlldyB8fCB0YWcuc3RhcnRzV2l0aCh0YWdUb1JldmlldyArIFwiL1wiKVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5yZXZpZXdEZWNrcy5oYXNPd25Qcm9wZXJ0eSh0YWcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV2aWV3RGVja3NbdGFnXSA9IG5ldyBSZXZpZXdEZWNrKHRhZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZElnbm9yZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzaG91bGRJZ25vcmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBmaWxlIGhhcyBubyBzY2hlZHVsaW5nIGluZm9ybWF0aW9uXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICEoXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnRtYXR0ZXIuaGFzT3duUHJvcGVydHkoXCJzci1kdWVcIikgJiZcclxuICAgICAgICAgICAgICAgICAgICBmcm9udG1hdHRlci5oYXNPd25Qcm9wZXJ0eShcInNyLWludGVydmFsXCIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnRtYXR0ZXIuaGFzT3duUHJvcGVydHkoXCJzci1lYXNlXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdGFnIG9mIHRhZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXZpZXdEZWNrcy5oYXNPd25Qcm9wZXJ0eSh0YWcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmV2aWV3RGVja3NbdGFnXS5uZXdOb3Rlcy5wdXNoKG5vdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMubmV3Tm90ZXMucHVzaChub3RlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZHVlVW5peDogbnVtYmVyID0gd2luZG93XHJcbiAgICAgICAgICAgICAgICAubW9tZW50KGZyb250bWF0dGVyW1wic3ItZHVlXCJdLCBbXCJZWVlZLU1NLUREXCIsIFwiREQtTU0tWVlZWVwiLCBcImRkZCBNTU0gREQgWVlZWVwiXSlcclxuICAgICAgICAgICAgICAgIC52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkTm90ZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBub3RlLFxyXG4gICAgICAgICAgICAgICAgZHVlVW5peCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHRhZyBvZiB0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXZpZXdEZWNrcy5oYXNPd25Qcm9wZXJ0eSh0YWcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZpZXdEZWNrc1t0YWddLnNjaGVkdWxlZE5vdGVzLnB1c2goeyBub3RlLCBkdWVVbml4IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVhc2VCeVBhdGhbbm90ZS5wYXRoXSA9IGZyb250bWF0dGVyW1wic3ItZWFzZVwiXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkdWVVbml4IDw9IG5vdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdWVOb3Rlc0NvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBuRGF5czogbnVtYmVyID0gTWF0aC5jZWlsKChkdWVVbml4IC0gbm93KSAvICgyNCAqIDM2MDAgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5kdWVEYXRlc05vdGVzLmhhc093blByb3BlcnR5KG5EYXlzKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdWVEYXRlc05vdGVzW25EYXlzXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kdWVEYXRlc05vdGVzW25EYXlzXSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3JhcGgucmFuaygwLjg1LCAwLjAwMDAwMSwgKG5vZGU6IHN0cmluZywgcmFuazogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXJhbmtzW25vZGVdID0gcmFuayAqIDEwMDAwO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBzb3J0IG5ldyBub3RlcyBieSBpbXBvcnRhbmNlXHJcbiAgICAgICAgdGhpcy5uZXdOb3RlcyA9IHRoaXMubmV3Tm90ZXMuc29ydChcclxuICAgICAgICAgICAgKGE6IFRGaWxlLCBiOiBURmlsZSkgPT4gKHRoaXMucGFnZXJhbmtzW2IucGF0aF0gfHwgMCkgLSAodGhpcy5wYWdlcmFua3NbYS5wYXRoXSB8fCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHNvcnQgc2NoZWR1bGVkIG5vdGVzIGJ5IGRhdGUgJiB3aXRoaW4gdGhvc2UgZGF5cywgc29ydCB0aGVtIGJ5IGltcG9ydGFuY2VcclxuICAgICAgICB0aGlzLnNjaGVkdWxlZE5vdGVzID0gdGhpcy5zY2hlZHVsZWROb3Rlcy5zb3J0KChhOiBTY2hlZE5vdGUsIGI6IFNjaGVkTm90ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSBhLmR1ZVVuaXggLSBiLmR1ZVVuaXg7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnBhZ2VyYW5rc1tiLm5vdGUucGF0aF0gfHwgMCkgLSAodGhpcy5wYWdlcmFua3NbYS5ub3RlLnBhdGhdIHx8IDApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBkZWNrS2V5IGluIHRoaXMucmV2aWV3RGVja3MpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXZpZXdEZWNrc1tkZWNrS2V5XS5zb3J0Tm90ZXModGhpcy5wYWdlcmFua3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vdGVDb3VudFRleHQ6IHN0cmluZyA9IHRoaXMuZHVlTm90ZXNDb3VudCA9PT0gMSA/IHQoXCJub3RlXCIpIDogdChcIm5vdGVzXCIpO1xyXG4gICAgICAgIGxldCBjYXJkQ291bnRUZXh0OiBzdHJpbmcgPSB0aGlzLmRlY2tUcmVlLmR1ZUZsYXNoY2FyZHNDb3VudCA9PT0gMSA/IHQoXCJjYXJkXCIpIDogdChcImNhcmRzXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFRleHQoXHJcbiAgICAgICAgICAgIHQoXCJSZXZpZXdcIikgK1xyXG4gICAgICAgICAgICAgICAgYDogJHt0aGlzLmR1ZU5vdGVzQ291bnR9ICR7bm90ZUNvdW50VGV4dH0sIGAgK1xyXG4gICAgICAgICAgICAgICAgYCR7dGhpcy5kZWNrVHJlZS5kdWVGbGFzaGNhcmRzQ291bnR9ICR7Y2FyZENvdW50VGV4dH0gYCArXHJcbiAgICAgICAgICAgICAgICB0KFwiZHVlXCIpXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJldmlld1F1ZXVlVmlldy5yZWRyYXcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3Rlc1N5bmNMb2NrID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc2F2ZVJldmlld1Jlc3BvbnNlKG5vdGU6IFRGaWxlLCByZXNwb25zZTogUmV2aWV3UmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgZmlsZUNhY2hlZERhdGEgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShub3RlKSB8fCB7fTtcclxuICAgICAgICBsZXQgZnJvbnRtYXR0ZXIgPSBmaWxlQ2FjaGVkRGF0YS5mcm9udG1hdHRlciB8fCA8UmVjb3JkPHN0cmluZywgYW55Pj57fTtcclxuXHJcbiAgICAgICAgbGV0IHRhZ3MgPSBnZXRBbGxUYWdzKGZpbGVDYWNoZWREYXRhKSB8fCBbXTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLnNldHRpbmdzLm5vdGVGb2xkZXJzVG9JZ25vcmUuc29tZSgoZm9sZGVyKSA9PiBub3RlLnBhdGguc3RhcnRzV2l0aChmb2xkZXIpKSkge1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKHQoXCJOb3RlIGlzIHNhdmVkIHVuZGVyIGlnbm9yZWQgZm9sZGVyIChjaGVjayBzZXR0aW5ncykuXCIpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNob3VsZElnbm9yZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgZm9yIChsZXQgdGFnIG9mIHRhZ3MpIHtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLnRhZ3NUb1Jldmlldy5zb21lKFxyXG4gICAgICAgICAgICAgICAgICAgICh0YWdUb1JldmlldykgPT4gdGFnID09PSB0YWdUb1JldmlldyB8fCB0YWcuc3RhcnRzV2l0aCh0YWdUb1JldmlldyArIFwiL1wiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHNob3VsZElnbm9yZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzaG91bGRJZ25vcmUpIHtcclxuICAgICAgICAgICAgbmV3IE5vdGljZSh0KFwiUGxlYXNlIHRhZyB0aGUgbm90ZSBhcHByb3ByaWF0ZWx5IGZvciByZXZpZXdpbmcgKGluIHNldHRpbmdzKS5cIikpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZmlsZVRleHQ6IHN0cmluZyA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQobm90ZSk7XHJcbiAgICAgICAgbGV0IGVhc2U6IG51bWJlcixcclxuICAgICAgICAgICAgaW50ZXJ2YWw6IG51bWJlcixcclxuICAgICAgICAgICAgZGVsYXlCZWZvcmVSZXZpZXc6IG51bWJlcixcclxuICAgICAgICAgICAgbm93OiBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIC8vIG5ldyBub3RlXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAhKFxyXG4gICAgICAgICAgICAgICAgZnJvbnRtYXR0ZXIuaGFzT3duUHJvcGVydHkoXCJzci1kdWVcIikgJiZcclxuICAgICAgICAgICAgICAgIGZyb250bWF0dGVyLmhhc093blByb3BlcnR5KFwic3ItaW50ZXJ2YWxcIikgJiZcclxuICAgICAgICAgICAgICAgIGZyb250bWF0dGVyLmhhc093blByb3BlcnR5KFwic3ItZWFzZVwiKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5rVG90YWw6IG51bWJlciA9IDAsXHJcbiAgICAgICAgICAgICAgICBsaW5rUEdUb3RhbDogbnVtYmVyID0gMCxcclxuICAgICAgICAgICAgICAgIHRvdGFsTGlua0NvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgc3RhdE9iaiBvZiB0aGlzLmluY29taW5nTGlua3Nbbm90ZS5wYXRoXSB8fCBbXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVhc2U6IG51bWJlciA9IHRoaXMuZWFzZUJ5UGF0aFtzdGF0T2JqLnNvdXJjZVBhdGhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rVG90YWwgKz0gc3RhdE9iai5saW5rQ291bnQgKiB0aGlzLnBhZ2VyYW5rc1tzdGF0T2JqLnNvdXJjZVBhdGhdICogZWFzZTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rUEdUb3RhbCArPSB0aGlzLnBhZ2VyYW5rc1tzdGF0T2JqLnNvdXJjZVBhdGhdICogc3RhdE9iai5saW5rQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxMaW5rQ291bnQgKz0gc3RhdE9iai5saW5rQ291bnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBvdXRnb2luZ0xpbmtzID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5yZXNvbHZlZExpbmtzW25vdGUucGF0aF0gfHwge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGxpbmtlZEZpbGVQYXRoIGluIG91dGdvaW5nTGlua3MpIHtcclxuICAgICAgICAgICAgICAgIGxldCBlYXNlOiBudW1iZXIgPSB0aGlzLmVhc2VCeVBhdGhbbGlua2VkRmlsZVBhdGhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rVG90YWwgKz1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdMaW5rc1tsaW5rZWRGaWxlUGF0aF0gKiB0aGlzLnBhZ2VyYW5rc1tsaW5rZWRGaWxlUGF0aF0gKiBlYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmtQR1RvdGFsICs9IHRoaXMucGFnZXJhbmtzW2xpbmtlZEZpbGVQYXRoXSAqIG91dGdvaW5nTGlua3NbbGlua2VkRmlsZVBhdGhdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsTGlua0NvdW50ICs9IG91dGdvaW5nTGlua3NbbGlua2VkRmlsZVBhdGhdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgbGlua0NvbnRyaWJ1dGlvbjogbnVtYmVyID1cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5tYXhMaW5rRmFjdG9yICpcclxuICAgICAgICAgICAgICAgIE1hdGgubWluKDEuMCwgTWF0aC5sb2codG90YWxMaW5rQ291bnQgKyAwLjUpIC8gTWF0aC5sb2coNjQpKTtcclxuICAgICAgICAgICAgZWFzZSA9IE1hdGgucm91bmQoXHJcbiAgICAgICAgICAgICAgICAoMS4wIC0gbGlua0NvbnRyaWJ1dGlvbikgKiB0aGlzLmRhdGEuc2V0dGluZ3MuYmFzZUVhc2UgK1xyXG4gICAgICAgICAgICAgICAgICAgICh0b3RhbExpbmtDb3VudCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyAobGlua0NvbnRyaWJ1dGlvbiAqIGxpbmtUb3RhbCkgLyBsaW5rUEdUb3RhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGxpbmtDb250cmlidXRpb24gKiB0aGlzLmRhdGEuc2V0dGluZ3MuYmFzZUVhc2UpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGludGVydmFsID0gMTtcclxuICAgICAgICAgICAgZGVsYXlCZWZvcmVSZXZpZXcgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGludGVydmFsID0gZnJvbnRtYXR0ZXJbXCJzci1pbnRlcnZhbFwiXTtcclxuICAgICAgICAgICAgZWFzZSA9IGZyb250bWF0dGVyW1wic3ItZWFzZVwiXTtcclxuICAgICAgICAgICAgZGVsYXlCZWZvcmVSZXZpZXcgPVxyXG4gICAgICAgICAgICAgICAgbm93IC1cclxuICAgICAgICAgICAgICAgIHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICAgIC5tb21lbnQoZnJvbnRtYXR0ZXJbXCJzci1kdWVcIl0sIFtcIllZWVktTU0tRERcIiwgXCJERC1NTS1ZWVlZXCIsIFwiZGRkIE1NTSBERCBZWVlZXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgIC52YWx1ZU9mKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2NoZWRPYmo6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSBzY2hlZHVsZShcclxuICAgICAgICAgICAgcmVzcG9uc2UsXHJcbiAgICAgICAgICAgIGludGVydmFsLFxyXG4gICAgICAgICAgICBlYXNlLFxyXG4gICAgICAgICAgICBkZWxheUJlZm9yZVJldmlldyxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLFxyXG4gICAgICAgICAgICB0aGlzLmR1ZURhdGVzTm90ZXNcclxuICAgICAgICApO1xyXG4gICAgICAgIGludGVydmFsID0gc2NoZWRPYmouaW50ZXJ2YWw7XHJcbiAgICAgICAgZWFzZSA9IHNjaGVkT2JqLmVhc2U7XHJcblxyXG4gICAgICAgIGxldCBkdWUgPSB3aW5kb3cubW9tZW50KG5vdyArIGludGVydmFsICogMjQgKiAzNjAwICogMTAwMCk7XHJcbiAgICAgICAgbGV0IGR1ZVN0cmluZzogc3RyaW5nID0gZHVlLmZvcm1hdChcIllZWVktTU0tRERcIik7XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGlmIHNjaGVkdWxpbmcgaW5mbyBleGlzdHNcclxuICAgICAgICBpZiAoU0NIRURVTElOR19JTkZPX1JFR0VYLnRlc3QoZmlsZVRleHQpKSB7XHJcbiAgICAgICAgICAgIGxldCBzY2hlZHVsaW5nSW5mbyA9IFNDSEVEVUxJTkdfSU5GT19SRUdFWC5leGVjKGZpbGVUZXh0KSE7XHJcbiAgICAgICAgICAgIGZpbGVUZXh0ID0gZmlsZVRleHQucmVwbGFjZShcclxuICAgICAgICAgICAgICAgIFNDSEVEVUxJTkdfSU5GT19SRUdFWCxcclxuICAgICAgICAgICAgICAgIGAtLS1cXG4ke3NjaGVkdWxpbmdJbmZvWzFdfXNyLWR1ZTogJHtkdWVTdHJpbmd9XFxuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYHNyLWludGVydmFsOiAke2ludGVydmFsfVxcbnNyLWVhc2U6ICR7ZWFzZX1cXG5gICtcclxuICAgICAgICAgICAgICAgICAgICBgJHtzY2hlZHVsaW5nSW5mb1s1XX0tLS1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChZQU1MX0ZST05UX01BVFRFUl9SRUdFWC50ZXN0KGZpbGVUZXh0KSkge1xyXG4gICAgICAgICAgICAvLyBuZXcgbm90ZSB3aXRoIGV4aXN0aW5nIFlBTUwgZnJvbnQgbWF0dGVyXHJcbiAgICAgICAgICAgIGxldCBleGlzdGluZ1lhbWwgPSBZQU1MX0ZST05UX01BVFRFUl9SRUdFWC5leGVjKGZpbGVUZXh0KSE7XHJcbiAgICAgICAgICAgIGZpbGVUZXh0ID0gZmlsZVRleHQucmVwbGFjZShcclxuICAgICAgICAgICAgICAgIFlBTUxfRlJPTlRfTUFUVEVSX1JFR0VYLFxyXG4gICAgICAgICAgICAgICAgYC0tLVxcbiR7ZXhpc3RpbmdZYW1sWzFdfXNyLWR1ZTogJHtkdWVTdHJpbmd9XFxuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYHNyLWludGVydmFsOiAke2ludGVydmFsfVxcbnNyLWVhc2U6ICR7ZWFzZX1cXG4tLS1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmlsZVRleHQgPVxyXG4gICAgICAgICAgICAgICAgYC0tLVxcbnNyLWR1ZTogJHtkdWVTdHJpbmd9XFxuc3ItaW50ZXJ2YWw6ICR7aW50ZXJ2YWx9XFxuYCArXHJcbiAgICAgICAgICAgICAgICBgc3ItZWFzZTogJHtlYXNlfVxcbi0tLVxcblxcbiR7ZmlsZVRleHR9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEuc2V0dGluZ3MuYnVyeVNpYmxpbmdDYXJkcykge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZpbmRGbGFzaGNhcmRzKG5vdGUsIFtdLCB0cnVlKTsgLy8gYnVyeSBhbGwgY2FyZHMgaW4gY3VycmVudCBub3RlXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZVBsdWdpbkRhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KG5vdGUsIGZpbGVUZXh0KTtcclxuXHJcbiAgICAgICAgbmV3IE5vdGljZSh0KFwiUmVzcG9uc2UgcmVjZWl2ZWQuXCIpKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5ub3Rlc1N5bmNMb2NrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN5bmMoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2V0dGluZ3MuYXV0b05leHROb3RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXZpZXdOZXh0Tm90ZSh0aGlzLmxhc3RTZWxlY3RlZFJldmlld0RlY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZXZpZXdOZXh0Tm90ZU1vZGFsKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGxldCByZXZpZXdEZWNrTmFtZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXModGhpcy5yZXZpZXdEZWNrcyk7XHJcbiAgICAgICAgaWYgKHJldmlld0RlY2tOYW1lcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXZpZXdOZXh0Tm90ZShyZXZpZXdEZWNrTmFtZXNbMF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBkZWNrU2VsZWN0aW9uTW9kYWwgPSBuZXcgUmV2aWV3RGVja1NlbGVjdGlvbk1vZGFsKHRoaXMuYXBwLCByZXZpZXdEZWNrTmFtZXMpO1xyXG4gICAgICAgICAgICBkZWNrU2VsZWN0aW9uTW9kYWwuc3VibWl0Q2FsbGJhY2sgPSAoZGVja0tleTogc3RyaW5nKSA9PiB0aGlzLnJldmlld05leHROb3RlKGRlY2tLZXkpO1xyXG4gICAgICAgICAgICBkZWNrU2VsZWN0aW9uTW9kYWwub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZXZpZXdOZXh0Tm90ZShkZWNrS2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBpZiAoIXRoaXMucmV2aWV3RGVja3MuaGFzT3duUHJvcGVydHkoZGVja0tleSkpIHtcclxuICAgICAgICAgICAgbmV3IE5vdGljZShcIk5vIGRlY2sgZXhpc3RzIGZvciBcIiArIGRlY2tLZXkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZFJldmlld0RlY2sgPSBkZWNrS2V5O1xyXG4gICAgICAgIGxldCBkZWNrID0gdGhpcy5yZXZpZXdEZWNrc1tkZWNrS2V5XTtcclxuXHJcbiAgICAgICAgaWYgKGRlY2suc2NoZWR1bGVkTm90ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmRhdGEuc2V0dGluZ3Mub3BlblJhbmRvbU5vdGVcclxuICAgICAgICAgICAgICAgID8gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGVjay5zY2hlZHVsZWROb3Rlcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLm9wZW5GaWxlKGRlY2suc2NoZWR1bGVkTm90ZXNbaW5kZXhdLm5vdGUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGVjay5uZXdOb3Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZGF0YS5zZXR0aW5ncy5vcGVuUmFuZG9tTm90ZVxyXG4gICAgICAgICAgICAgICAgPyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkZWNrLm5ld05vdGVzLmxlbmd0aClcclxuICAgICAgICAgICAgICAgIDogMDtcclxuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYub3BlbkZpbGUoZGVjay5uZXdOb3Rlc1tpbmRleF0pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXcgTm90aWNlKHQoXCJZb3UncmUgYWxsIGNhdWdodCB1cCBub3cgOkQuXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBmbGFzaGNhcmRzX3N5bmMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmxhc2hjYXJkc1N5bmNMb2NrKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5mbGFzaGNhcmRzU3luY0xvY2sgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgbm90ZXM6IFRGaWxlW10gPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVja1RyZWUgPSBuZXcgRGVjayhcInJvb3RcIiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHMgPSB7fTtcclxuXHJcbiAgICAgICAgbGV0IG5vdyA9IHdpbmRvdy5tb21lbnQoRGF0ZS5ub3coKSk7XHJcbiAgICAgICAgbGV0IHRvZGF5RGF0ZTogc3RyaW5nID0gbm93LmZvcm1hdChcIllZWVktTU0tRERcIik7XHJcbiAgICAgICAgLy8gY2xlYXIgbGlzdCBpZiB3ZSd2ZSBjaGFuZ2VkIGRhdGVzXHJcbiAgICAgICAgaWYgKHRvZGF5RGF0ZSAhPT0gdGhpcy5kYXRhLmJ1cnlEYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5idXJ5RGF0ZSA9IHRvZGF5RGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmJ1cnlMaXN0ID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbm90ZVBhdGhzU2V0OiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcclxuICAgICAgICBmb3IgKGxldCBub3RlIG9mIG5vdGVzKSB7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5ub3RlRm9sZGVyc1RvSWdub3JlLnNvbWUoKGZvbGRlcikgPT5cclxuICAgICAgICAgICAgICAgICAgICBub3RlLnBhdGguc3RhcnRzV2l0aChmb2xkZXIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5vdGVQYXRoc1NldC5hZGQobm90ZS5wYXRoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZpbmQgZGVjayBwYXRoXHJcbiAgICAgICAgICAgIGxldCBkZWNrUGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5zZXR0aW5ncy5jb252ZXJ0Rm9sZGVyc1RvRGVja3MpIHtcclxuICAgICAgICAgICAgICAgIGRlY2tQYXRoID0gbm90ZS5wYXRoLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICAgICAgICAgIGRlY2tQYXRoLnBvcCgpOyAvLyByZW1vdmUgZmlsZW5hbWVcclxuICAgICAgICAgICAgICAgIGlmIChkZWNrUGF0aC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWNrUGF0aCA9IFtcIi9cIl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlsZUNhY2hlZERhdGEgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShub3RlKSB8fCB7fTtcclxuICAgICAgICAgICAgICAgIGxldCB0YWdzID0gZ2V0QWxsVGFncyhmaWxlQ2FjaGVkRGF0YSkgfHwgW107XHJcblxyXG4gICAgICAgICAgICAgICAgb3V0ZXI6IGZvciAobGV0IHRhZ1RvUmV2aWV3IG9mIHRoaXMuZGF0YS5zZXR0aW5ncy5mbGFzaGNhcmRUYWdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdGFnIG9mIHRhZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhZyA9PT0gdGFnVG9SZXZpZXcgfHwgdGFnLnN0YXJ0c1dpdGgodGFnVG9SZXZpZXcgKyBcIi9cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY2tQYXRoID0gdGFnLnN1YnN0cmluZygxKS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRlY2tQYXRoLmxlbmd0aCA9PT0gMCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLmNhY2hlLmhhc093blByb3BlcnR5KG5vdGUucGF0aCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmaWxlQ2FjaGU6IFNSRmlsZUNhY2hlID0gdGhpcy5kYXRhLmNhY2hlW25vdGUucGF0aF07XHJcbiAgICAgICAgICAgICAgICAvLyBIYXMgZmlsZSBjaGFuZ2VkP1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVDYWNoZS5sYXN0VXBkYXRlZCA9PT0gbm90ZS5zdGF0Lm10aW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVDYWNoZS50b3RhbENhcmRzID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFmaWxlQ2FjaGUuaGFzTmV3Q2FyZHMgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93LnZhbHVlT2YoKSA8IHdpbmRvdy5tb21lbnQoZmlsZUNhY2hlLm5leHREdWVEYXRlLCBcIllZWVktTU0tRERcIikudmFsdWVPZigpXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVja1RyZWUuY3JlYXRlRGVjayhbLi4uZGVja1BhdGhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNrVHJlZS5jb3VudEZsYXNoY2FyZChkZWNrUGF0aCwgZmlsZUNhY2hlLnRvdGFsQ2FyZHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZmluZEZsYXNoY2FyZHMobm90ZSwgZGVja1BhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5maW5kRmxhc2hjYXJkcyhub3RlLCBkZWNrUGF0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZpbmRGbGFzaGNhcmRzKG5vdGUsIGRlY2tQYXRoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgW25EYXksIGNvdW50XSBvZiBPYmplY3QuZW50cmllcyhcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5jYWNoZVtub3RlLnBhdGhdLmR1ZURhdGVzRmxhc2hjYXJkc1xyXG4gICAgICAgICAgICApKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZHVlRGF0ZXNGbGFzaGNhcmRzLmhhc093blByb3BlcnR5KG5EYXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHNbbkRheV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kdWVEYXRlc0ZsYXNoY2FyZHNbbkRheV0gKz0gY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB1bnVzZWQgY2FjaGUgZW50cmllc1xyXG4gICAgICAgIGZvciAobGV0IGNhY2hlZFBhdGggaW4gdGhpcy5kYXRhLmNhY2hlKSB7XHJcbiAgICAgICAgICAgIGlmICghbm90ZVBhdGhzU2V0LmhhcyhjYWNoZWRQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGF0YS5jYWNoZVtjYWNoZWRQYXRoXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxvZ2dlci5pbmZvKGBGbGFzaGNhcmQgc3luYyB0b29rICR7RGF0ZS5ub3coKSAtIG5vdy52YWx1ZU9mKCl9bXNgKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNhdmVQbHVnaW5EYXRhKCk7XHJcblxyXG4gICAgICAgIC8vIHNvcnQgdGhlIGRlY2sgbmFtZXNcclxuICAgICAgICB0aGlzLmRlY2tUcmVlLnNvcnRTdWJkZWNrc0xpc3QoKTtcclxuXHJcbiAgICAgICAgbGV0IG5vdGVDb3VudFRleHQ6IHN0cmluZyA9IHRoaXMuZHVlTm90ZXNDb3VudCA9PT0gMSA/IHQoXCJub3RlXCIpIDogdChcIm5vdGVzXCIpO1xyXG4gICAgICAgIGxldCBjYXJkQ291bnRUZXh0OiBzdHJpbmcgPSB0aGlzLmRlY2tUcmVlLmR1ZUZsYXNoY2FyZHNDb3VudCA9PT0gMSA/IHQoXCJjYXJkXCIpIDogdChcImNhcmRzXCIpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLnNldFRleHQoXHJcbiAgICAgICAgICAgIHQoXCJSZXZpZXdcIikgK1xyXG4gICAgICAgICAgICAgICAgYDogJHt0aGlzLmR1ZU5vdGVzQ291bnR9ICR7bm90ZUNvdW50VGV4dH0sIGAgK1xyXG4gICAgICAgICAgICAgICAgYCR7dGhpcy5kZWNrVHJlZS5kdWVGbGFzaGNhcmRzQ291bnR9ICR7Y2FyZENvdW50VGV4dH0gYCArXHJcbiAgICAgICAgICAgICAgICB0KFwiZHVlXCIpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5mbGFzaGNhcmRzU3luY0xvY2sgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBmaW5kRmxhc2hjYXJkcyhcclxuICAgICAgICBub3RlOiBURmlsZSxcclxuICAgICAgICBkZWNrUGF0aDogc3RyaW5nW10sXHJcbiAgICAgICAgYnVyeU9ubHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IGZpbGVUZXh0OiBzdHJpbmcgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKG5vdGUpO1xyXG4gICAgICAgIGxldCBmaWxlQ2FjaGVkRGF0YSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKG5vdGUpIHx8IHt9O1xyXG4gICAgICAgIGxldCBoZWFkaW5nczogSGVhZGluZ0NhY2hlW10gPSBmaWxlQ2FjaGVkRGF0YS5oZWFkaW5ncyB8fCBbXTtcclxuICAgICAgICBsZXQgZmlsZUNoYW5nZWQ6IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICAgICAgZGVja0FkZGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIGNhY2hpbmcgaW5mb3JtYXRpb25cclxuICAgICAgICBsZXQgaGFzTmV3Q2FyZHM6IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICAgICAgdG90YWxDYXJkczogbnVtYmVyID0gMCxcclxuICAgICAgICAgICAgbmV4dER1ZURhdGU6IG51bWJlciA9IEluZmluaXR5LCAvLyAwMzoxNDowNyBVVEMsIEphbnVhcnkgMTkgMjAzOCBoYWhhXHJcbiAgICAgICAgICAgIGR1ZURhdGVzRmxhc2hjYXJkczogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9O1xyXG5cclxuICAgICAgICBsZXQgbm93OiBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGxldCBwYXJzZWRDYXJkczogW0NhcmRUeXBlLCBzdHJpbmcsIG51bWJlcl1bXSA9IHBhcnNlKFxyXG4gICAgICAgICAgICBmaWxlVGV4dCxcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLnNpbmdsZWxpbmVDYXJkU2VwYXJhdG9yLFxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcixcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzLm11bHRpbGluZUNhcmRTZXBhcmF0b3IsXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVSZXZlcnNlZENhcmRTZXBhcmF0b3JcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLmluZm8ocGFyc2VkQ2FyZHMpO1xyXG4gICAgICAgIGZvciAobGV0IHBhcnNlZENhcmQgb2YgcGFyc2VkQ2FyZHMpIHtcclxuICAgICAgICAgICAgbGV0IGNhcmRUeXBlOiBDYXJkVHlwZSA9IHBhcnNlZENhcmRbMF0sXHJcbiAgICAgICAgICAgICAgICBjYXJkVGV4dDogc3RyaW5nID0gcGFyc2VkQ2FyZFsxXSxcclxuICAgICAgICAgICAgICAgIGxpbmVObzogbnVtYmVyID0gcGFyc2VkQ2FyZFsyXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuQ2xvemUgJiYgdGhpcy5kYXRhLnNldHRpbmdzLmRpc2FibGVDbG96ZUNhcmRzKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGNhcmRUZXh0SGFzaDogc3RyaW5nID0gY3lyYjUzKGNhcmRUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChidXJ5T25seSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLmJ1cnlMaXN0LnB1c2goY2FyZFRleHRIYXNoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRlY2tBZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWNrVHJlZS5jcmVhdGVEZWNrKFsuLi5kZWNrUGF0aF0pO1xyXG4gICAgICAgICAgICAgICAgZGVja0FkZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHNpYmxpbmdNYXRjaGVzOiBbc3RyaW5nLCBzdHJpbmddW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKGNhcmRUeXBlID09PSBDYXJkVHlwZS5DbG96ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250OiBzdHJpbmcsIGJhY2s6IHN0cmluZztcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG0gb2YgY2FyZFRleHQubWF0Y2hBbGwoLz09KC4qPyk9PS9nbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGVsZXRpb25TdGFydDogbnVtYmVyID0gbS5pbmRleCEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0aW9uRW5kOiBudW1iZXIgPSBkZWxldGlvblN0YXJ0ICsgbVswXS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgZGVsZXRpb25TdGFydCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIHN0eWxlPSdjb2xvcjojMjE5NmYzJz5bLi4uXTwvc3Bhbj5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRUZXh0LnN1YnN0cmluZyhkZWxldGlvbkVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbnQgPSBmcm9udC5yZXBsYWNlKC89PS9nbSwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFjayA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRUZXh0LnN1YnN0cmluZygwLCBkZWxldGlvblN0YXJ0KSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gc3R5bGU9J2NvbG9yOiMyMTk2ZjMnPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKGRlbGV0aW9uU3RhcnQsIGRlbGV0aW9uRW5kKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPC9zcGFuPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKGRlbGV0aW9uRW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrID0gYmFjay5yZXBsYWNlKC89PS9nbSwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2libGluZ01hdGNoZXMucHVzaChbZnJvbnQsIGJhY2tdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBpZHg6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuU2luZ2xlTGluZUJhc2ljKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY2FyZFRleHQuaW5kZXhPZih0aGlzLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZUNhcmRTZXBhcmF0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmdNYXRjaGVzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgaWR4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKGlkeCArIHRoaXMuZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lQ2FyZFNlcGFyYXRvci5sZW5ndGgpLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuU2luZ2xlTGluZVJldmVyc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY2FyZFRleHQuaW5kZXhPZih0aGlzLmRhdGEuc2V0dGluZ3Muc2luZ2xlbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNpZGUxOiBzdHJpbmcgPSBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgaWR4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkZTI6IHN0cmluZyA9IGNhcmRUZXh0LnN1YnN0cmluZyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkeCArIHRoaXMuZGF0YS5zZXR0aW5ncy5zaW5nbGVsaW5lUmV2ZXJzZWRDYXJkU2VwYXJhdG9yLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmdNYXRjaGVzLnB1c2goW3NpZGUxLCBzaWRlMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmdNYXRjaGVzLnB1c2goW3NpZGUyLCBzaWRlMV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuTXVsdGlMaW5lQmFzaWMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHggPSBjYXJkVGV4dC5pbmRleE9mKFwiXFxuXCIgKyB0aGlzLmRhdGEuc2V0dGluZ3MubXVsdGlsaW5lQ2FyZFNlcGFyYXRvciArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNpYmxpbmdNYXRjaGVzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgaWR4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZFRleHQuc3Vic3RyaW5nKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4ICsgMiArIHRoaXMuZGF0YS5zZXR0aW5ncy5tdWx0aWxpbmVDYXJkU2VwYXJhdG9yLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjYXJkVHlwZSA9PT0gQ2FyZFR5cGUuTXVsdGlMaW5lUmV2ZXJzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHggPSBjYXJkVGV4dC5pbmRleE9mKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcblwiICsgdGhpcy5kYXRhLnNldHRpbmdzLm11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvciArIFwiXFxuXCJcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaWRlMTogc3RyaW5nID0gY2FyZFRleHQuc3Vic3RyaW5nKDAsIGlkeCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZGUyOiBzdHJpbmcgPSBjYXJkVGV4dC5zdWJzdHJpbmcoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHggKyAyICsgdGhpcy5kYXRhLnNldHRpbmdzLm11bHRpbGluZVJldmVyc2VkQ2FyZFNlcGFyYXRvci5sZW5ndGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nTWF0Y2hlcy5wdXNoKFtzaWRlMSwgc2lkZTJdKTtcclxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5nTWF0Y2hlcy5wdXNoKFtzaWRlMiwgc2lkZTFdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHNjaGVkdWxpbmc6IFJlZ0V4cE1hdGNoQXJyYXlbXSA9IFsuLi5jYXJkVGV4dC5tYXRjaEFsbChNVUxUSV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUildO1xyXG4gICAgICAgICAgICBpZiAoc2NoZWR1bGluZy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICBzY2hlZHVsaW5nID0gWy4uLmNhcmRUZXh0Lm1hdGNoQWxsKExFR0FDWV9TQ0hFRFVMSU5HX0VYVFJBQ1RPUildO1xyXG5cclxuICAgICAgICAgICAgLy8gd2UgaGF2ZSBzb21lIGV4dHJhIHNjaGVkdWxpbmcgZGF0ZXMgdG8gZGVsZXRlXHJcbiAgICAgICAgICAgIGlmIChzY2hlZHVsaW5nLmxlbmd0aCA+IHNpYmxpbmdNYXRjaGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkeFNjaGVkOiBudW1iZXIgPSBjYXJkVGV4dC5sYXN0SW5kZXhPZihcIjwhLS1TUjpcIikgKyA3O1xyXG4gICAgICAgICAgICAgICAgbGV0IG5ld0NhcmRUZXh0OiBzdHJpbmcgPSBjYXJkVGV4dC5zdWJzdHJpbmcoMCwgaWR4U2NoZWQpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWJsaW5nTWF0Y2hlcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBuZXdDYXJkVGV4dCArPSBgISR7c2NoZWR1bGluZ1tpXVsxXX0sJHtzY2hlZHVsaW5nW2ldWzJdfSwke3NjaGVkdWxpbmdbaV1bM119YDtcclxuICAgICAgICAgICAgICAgIG5ld0NhcmRUZXh0ICs9IFwiLS0+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlcGxhY2VtZW50UmVnZXggPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ2V4U3RyaW5nKGNhcmRUZXh0KSwgXCJnbVwiKTtcclxuICAgICAgICAgICAgICAgIGZpbGVUZXh0ID0gZmlsZVRleHQucmVwbGFjZShyZXBsYWNlbWVudFJlZ2V4LCAoXykgPT4gbmV3Q2FyZFRleHQpO1xyXG4gICAgICAgICAgICAgICAgZmlsZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgY29udGV4dDogc3RyaW5nID0gdGhpcy5kYXRhLnNldHRpbmdzLnNob3dDb250ZXh0SW5DYXJkc1xyXG4gICAgICAgICAgICAgICAgPyBnZXRDYXJkQ29udGV4dChsaW5lTm8sIGhlYWRpbmdzKVxyXG4gICAgICAgICAgICAgICAgOiBcIlwiO1xyXG4gICAgICAgICAgICBsZXQgc2libGluZ3M6IENhcmRbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpYmxpbmdNYXRjaGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnJvbnQ6IHN0cmluZyA9IHNpYmxpbmdNYXRjaGVzW2ldWzBdLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrOiBzdHJpbmcgPSBzaWJsaW5nTWF0Y2hlc1tpXVsxXS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNhcmRPYmo6IENhcmQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNEdWU6IGkgPCBzY2hlZHVsaW5nLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICBub3RlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVObyxcclxuICAgICAgICAgICAgICAgICAgICBmcm9udCxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhcmRUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgc2libGluZ0lkeDogaSxcclxuICAgICAgICAgICAgICAgICAgICBzaWJsaW5ncyxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdG90YWxDYXJkcysrO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNhcmQgc2NoZWR1bGVkXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHNjaGVkdWxpbmcubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGR1ZVVuaXg6IG51bWJlciA9IHdpbmRvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAubW9tZW50KHNjaGVkdWxpbmdbaV1bMV0sIFtcIllZWVktTU0tRERcIiwgXCJERC1NTS1ZWVlZXCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudmFsdWVPZigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkdWVVbml4IDwgbmV4dER1ZURhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dER1ZURhdGUgPSBkdWVVbml4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbkRheXM6IG51bWJlciA9IE1hdGguY2VpbCgoZHVlVW5peCAtIG5vdykgLyAoMjQgKiAzNjAwICogMTAwMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZHVlRGF0ZXNGbGFzaGNhcmRzLmhhc093blByb3BlcnR5KG5EYXlzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdWVEYXRlc0ZsYXNoY2FyZHNbbkRheXNdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZHVlRGF0ZXNGbGFzaGNhcmRzW25EYXlzXSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEuYnVyeUxpc3QuaW5jbHVkZXMoY2FyZFRleHRIYXNoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmNvdW50Rmxhc2hjYXJkKFsuLi5kZWNrUGF0aF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkdWVVbml4IDw9IG5vdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkT2JqLmludGVydmFsID0gcGFyc2VJbnQoc2NoZWR1bGluZ1tpXVsyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRPYmouZWFzZSA9IHBhcnNlSW50KHNjaGVkdWxpbmdbaV1bM10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkT2JqLmRlbGF5QmVmb3JlUmV2aWV3ID0gbm93IC0gZHVlVW5peDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNrVHJlZS5pbnNlcnRGbGFzaGNhcmQoWy4uLmRlY2tQYXRoXSwgY2FyZE9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNrVHJlZS5jb3VudEZsYXNoY2FyZChbLi4uZGVja1BhdGhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc05ld0NhcmRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc05ld0NhcmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5idXJ5TGlzdC5pbmNsdWRlcyhjeXJiNTMoY2FyZFRleHQpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2tUcmVlLmNvdW50Rmxhc2hjYXJkKFsuLi5kZWNrUGF0aF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNrVHJlZS5pbnNlcnRGbGFzaGNhcmQoWy4uLmRlY2tQYXRoXSwgY2FyZE9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2libGluZ3MucHVzaChjYXJkT2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFidXJ5T25seSlcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmNhY2hlW25vdGUucGF0aF0gPSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbENhcmRzLFxyXG4gICAgICAgICAgICAgICAgaGFzTmV3Q2FyZHMsXHJcbiAgICAgICAgICAgICAgICBuZXh0RHVlRGF0ZTpcclxuICAgICAgICAgICAgICAgICAgICBuZXh0RHVlRGF0ZSAhPT0gSW5maW5pdHkgPyB3aW5kb3cubW9tZW50KG5leHREdWVEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpIDogXCJcIixcclxuICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVkOiBub3RlLnN0YXQubXRpbWUsXHJcbiAgICAgICAgICAgICAgICBkdWVEYXRlc0ZsYXNoY2FyZHMsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChmaWxlQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkobm90ZSwgZmlsZVRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkUGx1Z2luRGF0YSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX0RBVEEsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgdGhpcy5kYXRhLnNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzYXZlUGx1Z2luRGF0YSgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoUkVWSUVXX1FVRVVFX1ZJRVdfVFlQRSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpLnNldFZpZXdTdGF0ZSh7XHJcbiAgICAgICAgICAgIHR5cGU6IFJFVklFV19RVUVVRV9WSUVXX1RZUEUsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2FyZENvbnRleHQoY2FyZExpbmU6IG51bWJlciwgaGVhZGluZ3M6IEhlYWRpbmdDYWNoZVtdKTogc3RyaW5nIHtcclxuICAgIGxldCBzdGFjazogSGVhZGluZ0NhY2hlW10gPSBbXTtcclxuICAgIGZvciAobGV0IGhlYWRpbmcgb2YgaGVhZGluZ3MpIHtcclxuICAgICAgICBpZiAoaGVhZGluZy5wb3NpdGlvbi5zdGFydC5saW5lID4gY2FyZExpbmUpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5sZXZlbCA+PSBoZWFkaW5nLmxldmVsKSB7XHJcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhY2sucHVzaChoZWFkaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY29udGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAgIGZvciAobGV0IGhlYWRpbmdPYmogb2Ygc3RhY2spIHtcclxuICAgICAgICBjb250ZXh0ICs9IGhlYWRpbmdPYmouaGVhZGluZyArIFwiID4gXCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29udGV4dC5zbGljZSgwLCAtMyk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIm1vbWVudCIsIlBsYXRmb3JtIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJOb3RpY2UiLCJNb2RhbCIsIk1hcmtkb3duVmlldyIsIk1hcmtkb3duUmVuZGVyZXIiLCJURmlsZSIsIkl0ZW1WaWV3IiwiTWVudSIsIkZ1enp5U3VnZ2VzdE1vZGFsIiwiUGx1Z2luIiwiYWRkSWNvbiIsImdyYXBoLnJlc2V0IiwiZ3JhcGgubGluayIsImdldEFsbFRhZ3MiLCJncmFwaC5yYW5rIl0sIm1hcHBpbmdzIjoiOzs7O0FBRUEsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUNsQyxJQUFJLElBQUksQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLE1BQU0sT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDLEVBQUU7QUFDMUUsUUFBUSxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUNoQyxZQUFZLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDckQsZ0JBQWdCLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDMUQsb0JBQW9CLE1BQU07QUFDMUIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7QUFDRDtJQUNBLEdBQWMsR0FBRyxDQUFDLFlBQVk7QUFDOUIsSUFBSSxJQUFJLElBQUksR0FBRztBQUNmLFFBQVEsS0FBSyxFQUFFLENBQUM7QUFDaEIsUUFBUSxLQUFLLEVBQUUsRUFBRTtBQUNqQixRQUFRLEtBQUssRUFBRSxFQUFFO0FBQ2pCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDbEQsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxNQUFNLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDOUQsWUFBWSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLFNBQVM7QUFDVDtBQUNBLFFBQVEsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENB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
