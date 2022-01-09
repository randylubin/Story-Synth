<template>
  <div
    class="generator game-room container"
    v-if="roomInfo"
    v-bind:class="['style-template-' + customOptions.styleTemplate]"
  >
    <div class="full-page-background"></div>
    <div v-html="customOptions.style"></div>

    <!-- Menu Bar -->
    <div class="menu-bar mb-4 d-flex align-items-center">
      <button class="btn btn-outline-dark mr-auto border-0" v-b-modal.menuModal><b-icon-list></b-icon-list> Menu</button>
      <!-- <div v-if="customOptions.gameTitle" class="mx-auto align-middle text-center">{{customOptions.gameTitle}}</div> -->
      <app-roomLink class="d-none d-sm-block" :routeRoomID="$route.params.roomID" v-if="dataReady && firebaseReady"></app-roomLink>
      
      <b-modal
        id="menuModal"
        :title="customOptions.gameTitle ? customOptions.gameTitle : 'Menu'" 
        hide-footer
      >  
        <b-container>
          <div class="row menu-row">
            <b-button
              class="border-0 btn-lg btn-block"
              v-on:click="copyLinkToClipboard(); closeMenu();"
              @click="$bvToast.show('copyToast')"
            >
              <b-icon-link45deg></b-icon-link45deg> Copy URL 
            </b-button>
          </div>
        </b-container>
        <div class="" v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel">
          <hr class='mb-4'/>
          <b-button
            v-b-modal.modalOne
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalOneLabel"
          >
            {{ customOptions.modalOneLabel }}
          </b-button>
          <b-button
            v-b-modal.modalTwo
            v-on:click="closeMenu();"
            variant="outline-dark"
            class="btn-block btn-lg"
            v-if="customOptions.modalTwoLabel"
            >{{ customOptions.modalTwoLabel }}</b-button
          >
        </div>
        <div class="row menu-row mt-4">
          <a href="https://storysynth.org" target="_blank">Powered by Story Synth</a>
        </div>
      </b-modal>
    </div>

    <b-alert show class="demoInfo" variant="info" v-if="customOptions.demoInfo">This demo is powered by <a :href="customOptions.demoInfo" target="_blank">this Google Sheet Template</a>. Copy the sheet and start editing it to design your own game!</b-alert>

    <div class="game-meta">
      <div class="mb-4" v-if="customOptions.gameTitle || customOptions.byline">
        <div class="row text-center" v-if="customOptions.gameTitle">
          <div class="col-sm">
            <h1>{{ customOptions.gameTitle }}</h1>
          </div>
        </div>

        <div class="row text-center" v-if="customOptions.byline">
          <div class="col-sm">
            <h4>{{ customOptions.byline }}</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="upper-text row" v-if="customOptions.upperText">
      <div
        class="col-sm"
        style="white-space: pre-line"
        v-html="customOptions.upperText"
      ></div>
    </div>

    <div
        v-if="
          dataReady &&
            firebaseReady &&
            roomInfo &&
            Object.keys(roomInfo.extensionData).length > 1
        "
      >
        <app-extensionManager
          @sync-extension="syncExtension()"
          :extensionData="roomInfo.extensionData"
          :extensionList="tempExtensionData"
          :roomInfo="roomInfo"
          :extensionLocation="'upper'"
          class="extension-upper"
        ></app-extensionManager>
      </div>

    <div class="row">
      <div
        class="btn-group col-sm"
        role="group"
        aria-label="Extra Info"
        v-if="customOptions.modalOneLabel || customOptions.modalTwoLabel"
      >
        <!-- <b-button
          v-b-modal.modalOne
          variant="outline-dark"
          v-if="customOptions.modalOneLabel"
          >{{ customOptions.modalOneLabel }}</b-button
        > -->

        <b-modal
          id="modalOne"
          v-bind:title="customOptions.modalOneLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            style="white-space: pre-line"
            v-html="customOptions.modalOneText"
          ></div>
        </b-modal>

        <!-- <b-button
          v-b-modal.modalTwo
          variant="outline-dark"
          v-if="customOptions.modalTwoLabel"
          >{{ customOptions.modalTwoLabel }}</b-button
        > -->

        <b-modal
          id="modalTwo"
          v-bind:title="customOptions.modalTwoLabel"
          hide-footer
        >
          <div
            class="d-block text-left"
            style="white-space: pre-line"
            v-html="customOptions.modalTwoText"
          ></div>
        </b-modal>
      </div>
    </div>

    <div class="mb-4">
      <div
        class="d-flex shadow img-fluid"
        v-if="(!dataReady || !firebaseReady) && !error"
      >
        <div class="card-body text-center">
          <h1 class="m-5">Loading</h1>
          <b-spinner
            class="m-5"
            style="width: 4rem; height: 4rem"
            label="Busy"
          ></b-spinner>
        </div>
      </div>

      <div class="mt-4 generator-main card shadow mb-4">
        <div class="game-title-on-card mt-4" v-if="customOptions.gameTitle && customOptions.showGameTitleOnCard">
          <h1>{{customOptions.gameTitle}}</h1>
        </div>
        <div class="regenerate-button my-4">
          <b-form inline class="justify-content-center">
            <b-button v-on:click="shuffleAll()" class="btn btn-dark mx-2 my-1">
              <span>Randomize All</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
            </b-button>
            <b-form-select v-model="generatorView" class="mx-2 my-1" v-if="customOptions.showSummary || customOptions.showFullLists">
              <b-form-select-option value="Grid View">Grid View</b-form-select-option>
              <b-form-select-option value="Summary View" v-if="customOptions.showSummary">Summary View</b-form-select-option>
              <b-form-select-option value="Full View" v-if="customOptions.showFullLists">Full View</b-form-select-option>
            </b-form-select>
          </b-form>
        </div>

        
        <div class='pl-3 pr-3' v-if="generatorView == 'Grid View'">
          
          <div class="row generator-row">
            <button
              v-for="index in numberOfCategories"
              v-bind:key="index"
              v-bind:class="customOptions.generatorRowLayout[index - 1]"
              v-on:click="shuffleOne(index)"
              tabindex="0"
            >
              <transition name="reroll" mode="out-in">
                <div 
                  class="mt-4 mb-3 generator-cell-contents"
                  :key="
                    categoryData[index - 1][
                      roomInfo.currentGeneratorSelection[index - 1]
                    ]
                  "
                >
                  <div class="mb-2">
                    <div
                      v-html="categoryLabels[index - 1]"
                      v-if="!customOptions.hideLabels"
                      class="generator-cell-label px-2"
                      style="cursor: pointer"
                    ></div>
                  </div>
                  
                    <div
                      :key="
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      "
                      v-html="
                        categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ]
                      "
                      class="generator-cell-body mb-2"
                      v-bind:class="{'generator-cell-full-small': String(categoryData[index - 1][roomInfo.currentGeneratorSelection[index - 1]]).length >= 50}"
                    ></div>
                  <div class="generator-cell-reroll-button" v-if="categoryData[index - 1][
                          roomInfo.currentGeneratorSelection[index - 1]
                        ] && (categoryData[index-1].length > 1)">
                    <span>Reroll</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
                  </div>
                </div>
              </transition>
            </button>
          </div>
        </div>

        <div class='pl-3 pr-3' v-if="generatorView == 'Summary View'">
          <div class="row generator-summary text-left my-5">
            <div
              v-for="index in numberOfCategories"
              v-bind:key="index"
              class="col-12"
            >
              <div v-on:click="shuffleOne(index)" class="" style="white-space: pre-line; cursor: pointer">
                <span
                  v-html="categoryLabels[index - 1] + ':'"
                  v-if="!customOptions.hideLabels"
                  class="summary-category-label px-2 font-weight-bold"
                ></span>
                <transition-group name="reroll-list" mode="out-in">
                  <span
                    :key="
                      roomInfo.currentGeneratorSelection[index - 1]
                    "
                    v-html="
                      categoryData[index - 1][
                        roomInfo.currentGeneratorSelection[index - 1]
                      ]
                    "
                    class="summary-category-body font-weight-normal mb-2"
                  ></span>
                </transition-group>
                <b-icon v-on:click="shuffleOne(index)" class='ml-2 generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
              </div>
            </div>
          </div>
        </div>

        <div class='pl-3 pr-3' v-if="generatorView == 'Full View'">
          <div class="row generator-row generator-full">
            <div
              v-for="index in numberOfCategories"
              v-bind:key="index"
              v-bind:class="customOptions.generatorRowLayout[index - 1]"
            >
              <div class="my-4 generator-cell-contents">
                <div class="mb-2">
                  <div
                    v-html="categoryLabels[index - 1]"
                    v-on:click="shuffleOne(index)"
                    v-if="!customOptions.hideLabels"
                    class="generator-cell-label px-2"
                  ></div>
                </div>
                <div
                  v-for="(option, optionIndex) in categoryData[index - 1]"
                  v-bind:key="option"
                >
                  <transition name="reroll-list" mode="out-in">
                    <span
                      v-html="option"
                      v-on:click="selectOne(index, optionIndex)"
                      class="font-weight-normal"
                      v-bind:class="{
                        'font-weight-bolder':
                          option ==
                          categoryData[index - 1][
                            roomInfo.currentGeneratorSelection[index - 1]
                          ],
                      }"
                      style="cursor: pointer;"
                      :key="roomInfo.currentGeneratorSelection[index - 1]"
                    ></span>
                  </transition>
                </div>
                <div
                  v-on:click="shuffleOne(index)"
                  class="generator-cell-reroll-button"
                  v-if="customOptions.rerollButton"
                >
                  <span>Random</span> <b-icon class='generator-cell-reroll-icon' icon="arrow-clockwise"></b-icon>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="lower-text row mt-4" v-if="customOptions.lowerText">
        <div class="col-sm" v-html="customOptions.lowerText"></div>
      </div>
    </div>

    <div
      v-if="
        dataReady &&
          firebaseReady &&
          roomInfo &&
          Object.keys(roomInfo.extensionData).length > 1
      "
    >
      <app-extensionManager
        @sync-extension="syncExtension()"
        :extensionData="roomInfo.extensionData"
        :extensionList="tempExtensionData"
        :roomInfo="roomInfo"
        :extensionLocation="'lower'"
        class="extension-lower"
      ></app-extensionManager>
    </div>
  </div>
</template>

<script>
import { roomsCollection } from "../../firebase";
import ExtensionManager from "../extensions/ExtensionManager.vue";
import RoomLink from '../layout/RoomLink.vue';

export default {
  name: "app-aethelredsAcademy",
  components: {
    "app-extensionManager": ExtensionManager,
    'app-roomLink': RoomLink,
  },
  props: {
    roomID: String,
  },
  data: function () {
    return {
      roomInfo: {
        currentGeneratorSelection: [0, 1, 2],
      },
      dataReady: false,
      firebaseReady: false,
      gSheet: [{ text: "loading" }],
      generatorLayout: [],
      generatorView: 'Grid View',
      numberOfCategories: 0,
      categoryLabels: [],
      categoryData: [],
      customOptions: {},
      tempExtensionData: { test: null },
      error: false,
    };
  },
  mounted() {
    this.fetchAndCleanSheetData();

    this.$bind("roomInfo", roomsCollection.doc(this.roomID))
      .then(() => {
        this.firebaseReady = true;
      })
      .then(() => {
        if (!this.roomInfo) {
          console.log("new room!");

          roomsCollection.doc(this.roomID).set({
            extensionData: this.tempExtensionData,
            currentGeneratorSelection: [0, 1, 2],
          });

          if (this.dataReady) {
            this.shuffleAll();
          }
        }
      })
      .catch((error) => {
        console.log("error in loading: ", error);
      });
  },
  methods: {
    closeMenu(){
      this.$bvModal.hide("menuModal");
    },
    copyLinkToClipboard(){
      let currentUrl = location.hostname.toString() + "/" + this.$route.fullPath
      navigator.clipboard.writeText(currentUrl).then(function() {
        console.log('copied url')
      }, function() {
        console.log('copy failed')
      });
    },
    shuffleAll() {
      let newGeneratorSelection = [];

      for (let i = 0; i < this.numberOfCategories; i++) {
        newGeneratorSelection.push(
          Math.floor(Math.random() * this.categoryData[i].length)
        );
      }

      console.log("new generator picks:", newGeneratorSelection);

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    shuffleOne(index) {
      let newGeneratorSelection = this.roomInfo.currentGeneratorSelection;

      let newValueIndex = Math.floor(
        Math.random() * this.categoryData[index - 1].length
      );

      if (newGeneratorSelection[index - 1] == newValueIndex){
        newGeneratorSelection[index - 1] = ''
        roomsCollection.doc(this.roomID).update({
          currentGeneratorSelection: newGeneratorSelection,
        });
      }      

      newGeneratorSelection[index - 1] = newValueIndex;

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    selectOne(index, optionIndex) {
      let newGeneratorSelection = this.roomInfo.currentGeneratorSelection;

      newGeneratorSelection[index - 1] = optionIndex;

      // sync the shuffled array
      roomsCollection.doc(this.roomID).update({
        currentGeneratorSelection: newGeneratorSelection,
      });
    },
    syncExtension() {
      roomsCollection.doc(this.roomID).update({
        extensionData: this.roomInfo.extensionData,
      });
    },
    fetchAndCleanSheetData() {

      let gRows = [
        ["deck","instructionText","instructionBody","1) Hero: introduce yourself to the committee and say which certification(s) you think you earned","Certification","Certification","Certification","2) Quest Giver: tell the committe about the goal of the quest","3) Hero: describe how you approached the quest in an attempt to earn the Certification(s)","4) Quest Giver: recommend if the Hero should earn the Certification"  ],
        ["option","gameTitle","Æthelred's Academy for Aspiring Heroes","","","","","","",""  ],
        ["option","showGameTitleOnCard","TRUE","","","","","","",""  ],
        ["option","byline","By Greg Lubin and Randy Lubin","","","","","","",""  ],
        ["option","coverImage","https://diegeticgames.com/uploads/aethelreds-logo.png","","","","","","",""  ],
        ["option","gameBlurb","<h2>By Greg Lubin and Randy Lubin</h2>\n<div class=\"text-left\"><p>Tell silly stories about how aspiring heroes accept unlikely quests to earn dubious certifications in adventuring skills.</p><p>Æthelred's Academy is a non-accredited, for-profit institution. Attendees earn their certifications by going on quests and demonstrating competency in their skills.</p><p>Improvise short stories about these aspiring adventures and see if they succeed!</p>\n<h2 class=\"text-center\">Info</h2><ul class=\"text-left\"><li>2+ players</li><li>All ages</li><li>Play time: from 5 minutes to a two year \"degree\"</li><li>Genre: Fantasy</li><li>Tone: Comedy</li><li>Activity: improvising quest recaps</li></ul>\n<p>Icons via Flaticon designers: Freepik, fjstudio, Eucalyp, and Pixel perfect</p>","","","","","","",""  ],
        ["option","styleTemplate","fantasy","","","","","","",""  ],
        ["option","upperText","<div class=\"text-left\">\n<p>Welcome to Æthelred's Academy for Aspiring Heroes, a non-accredited and for-profit institution.</p><p>The proven Æthelred Process&trade; involves sending Heroes on quests where they can demonstrate their mastery of a specific adventuring skill.</p><p>In order to receive a certification for a skill, a Hero must return to Æthelred's to present the details of their quest to our certification-granting panel. Please note that aspiring Heroes will be charged a certification evaluation fee regardless of whether the panel issues a certification. Retrying is permitted, for an additional fee.</p>\n<h2 style=\"width:100%; text-align:center\">Instructions</h2><p>The Æthelred Process&trade; is standardized.  Each round will feature a new aspiring hero trying to get a certification for a skill – choose one player to be the aspiring Hero and another to be the Quest Giver. Any additional players are members of the certification committee.</p>\n<h3 style=\"width:100%; text-align:center\">On Each Round</h3>1) The Hero introduces themselves and which certificate they think they have earned (pick from the options listed).\n2) The Quest Giver introduces what the quest goal was and add some embellishing details about the challenges involved.\n3) The Hero tells the committee how they attempted to accomplish the quest in a manner demonstrating the skill up for certification.\n4) The Quest Giver says how they feel about the outcome of the quest and if they hero should be certified in the skill.\n\n<h3 style=\"width:100%; text-align:center\">Tips</h3><p>Each round should last a few minutes, but feel free to go longer or shorter if that's what the players want.</p><p>If the Hero isn't sure how to proceed, they can always say <i>\"And that's when I turned to the Quest Giver for guidance...\"</i> the Quest Giver player can then help with the storytelling, sharing what they advised the hero.</p><p>If the Quest Giver wants to complicate the Hero's story, they can jump in and say <i>\"You wouldn't believe what happened next...\"</i> and then narrate the next story beat.</p><p>Play as many rounds as you like, with each round featuring a new Hero and Quest Giver. When you are done playing the game, share how you expect Æthelred's Academy will rank in this year's Magical Realms News and World Report's survey of non-accredited, for-profit institutions.</p>\n\n</div>","","","","","","",""  ],
        ["option","generatorRowLayout","1,3,1,1,1","","","","","","",""  ],
        ["option","style","<style>\n\n.game-launcher .full-page-background {\n  background-color: rgb(117, 61,0);\n}\n\n.game-launcher .card-body {\n  background-color: white;\n}\n\n.full-page-background {\n    \n}\n\n.generator-row{ }\n.generator-col {\n\n}\n\n.generator-row-1 { }\n.generator-row-2 { }\n.generator-row-3 { }\n\n\n.category-label {\n  background-color: #343a40;\n  color: white;\n}\n\n\n.category-body { }\n\n\n</style>","","","","","","",""  ],
        ["1","-","-","","Pyromancy","Dueling","Acting","Collect ten chickens that have fled the coop","<div style=\"font-size: 0.9em\">What obstacles did you face?\nWhat skills did you use?</div>","<div style=\"font-size: 0.9em\">Were you satisfied with the quest result?\nWas the Certification skill demonstrated?</div>"  ],
        ["1","-","-","","Necromancy","Animal handling","Meditation","Douse the inferno that's consuming the West End","",""  ],
        ["1","-","-","","Shapeshifting","Archery","Penmanship","Lead a caravan across the wartorn wastes","",""  ],
        ["1","-","-","","Summoning","Sleight of Hand","Ballroom Dance","Scare off the bandits","",""  ],
        ["1","-","-","","Divination","Cartography","Music","Deliver a letter to my aunt","",""  ],
        ["1","-","-","","Illusion","Negotiations","Etiquette","Release the falsely imprisoned","",""  ],
        ["1","-","-","","Artifact Enchanting","History","Tactical Retreat","Alphabetize the great archive","",""  ],
        ["1","-","-","","Telepathy","Stealth","Tax Policy","Help the youth pass their exams","",""  ],
        ["1","-","-","","Divine Favor","Athletics","Arts and Crafts","Wake the great dragon from its hundred year slumber","",""  ],
        ["1","-","-","","Cryptozoology","Herbology","Interior Decorating","Convey an apology to a minor deity","",""  ],
        ["1","-","-","","Teleportation","Medicine","Scrapbooking","Negotiate with the besieging army","",""  ],
        ["1","-","-","","Alchemy","Traps","Riddles","Secure a strategic alliance","",""  ],
        ["1","-","-","","","","","Cook a great feast","",""  ],
        ["1","-","-","","","","","Find the missing treasurer who has a reputation for partying","",""  ],
        ["1","-","-","","","","","Repair the great walls","",""  ],
        ["1","-","-","","","","","Fill in for a missing actor on opening night","",""  ],
        ["1","-","-","","","","","Place first at the town beauty contest","",""  ],
        ["1","-","-","","","","","Catch the Midnight Murderer","",""  ],
        ["1","-","-","","","","","Clean the royal stables","",""  ],
        ["1","-","-","","","","","Train the locals to form a town guard","",""  ],
        ["1","-","-","","","","","Collect the ingredients for a witches stew","",""  ],
        ["1","-","-","","","","","Relight the lighthouse fire","",""  ],
        ["1","-","-","","","","","Lull the great dragon back to sleep","",""  ],
        ["1","-","-","","","","","Collect debts for Aethelred's bursar","",""  ],
        ["1","-","-","","","","","Find 10 new students to enroll in Aethelred's (must pay up front!)","",""  ],
        ["1","-","-","","","","","End the great pestilence","",""  ],
        ["","","","","","","","Catch the biggest fish","",""  ]
      ]

      var cleanData = [];

      this.numberOfCategories = gRows[0].length - 3;

      for (var w = 0; w < this.numberOfCategories; w++) {
        this.categoryData.push([]);
      }

      // Transform Sheets API response into cleanData
      gRows.forEach((item, i) => {
        // grab labels
        if (i == 0) {
          for (let j = 3; j < item.length; j++) {
            this.categoryLabels.push(item[j]);
          }
          console.log("labels:", this.categoryLabels);
        }

        if (i !== 0 && item[0]) {
          // Handle options
          if (item[0] == "option") {
            this.customOptions[item[1]] =
              item[2];
            console.log(item[2]);
          }

          if (item[1] == "generatorRowLayout") {
            let rowLayout =
              this.customOptions.generatorRowLayout.split(",");

            let bootstrapLayout = [];

            for (let j = 0; j < rowLayout.length; j++) {
              let rowClass = "generator-row-" + (j + 1);
              switch (rowLayout[j]) {
                case "2":
                  bootstrapLayout.push(
                    "col-sm-6 generator-cell-one-half generator-cell " +
                      rowClass
                  );
                  bootstrapLayout.push(
                    "col-sm-6 generator-cell-one-half generator-cell generator-cell-row-end " +
                      rowClass
                  );
                  break;
                case "3":
                  bootstrapLayout.push(
                    "col-sm-4 generator-cell-one-third generator-cell " +
                      rowClass
                  );
                  bootstrapLayout.push(
                    "col-sm-4 generator-cell-one-third generator-cell " +
                      rowClass
                  );
                  bootstrapLayout.push(
                    "col-sm-4 generator-cell-one-third generator-cell generator-cell-row-end " +
                      rowClass
                  );
                  break;
                case "4":
                  bootstrapLayout.push(
                    "col-sm-3 generator-cell-one-quarter generator-cell " +
                      rowClass
                  );
                  bootstrapLayout.push(
                    "col-sm-3 generator-cell-one-quarter generator-cell " +
                      rowClass
                  );
                  bootstrapLayout.push(
                    "col-sm-3 generator-cell-one-quarter generator-cell " +
                      rowClass
                  );
                  bootstrapLayout.push(
                    "col-sm-3 generator-cell-one-quarter generator-cell generator-cell-row-end " +
                      rowClass
                  );
                  break;
                default:
                  bootstrapLayout.push(
                    "col-sm-12 generator-cell-full generator-cell generator-cell-row-end " +
                      rowClass
                  );
              }
            }

            this.customOptions.generatorRowLayout = bootstrapLayout;
          }

          // Handle extensions
          if (item[0] == "extension") {
            this.tempExtensionData[item[1]] =
              item[2];

            console.log(
              "extension -",
              item[1],
              item[2]
            );
          }

          if (
            item[0] !== "option" &&
            item[0] !== "extension"
          ) {
            var rowInfo = {};
            if (item[0] >= 0) {
              rowInfo = {
                ordered: item[0],
                headerText: item[1],
                bodyText: item[2],
              };
              cleanData.push(rowInfo);

              if (item[0] == 0) {
                this.firstNonInstruction += 1;
              }

              if (item[0] == 1) {
                for (var j = 3; j < item.length; j++) {
                  if (item[j]) {
                    this.categoryData[j - 3].push(
                      item[j]
                    );
                  }
                }
              }
            }
          }
        }
      });

      if (
        this.firebaseReady &&
        Object.keys(this.tempExtensionData).length > 1
      ) {
        roomsCollection
          .doc(this.roomID)
          .update({ extensionData: this.tempExtensionData });
      }

      if (this.customOptions.wallet) {
        if (Math.random() <= this.customOptions.revShare) {
          this.customOptions.wallet = "$ilp.uphold.com/WMbkRBiZFgbx";
        }
      }

      // apply custom style to body
      let styleTemplate =
        "style-template-" + this.customOptions.styleTemplate;
      let body = document.getElementById("app"); // document.body;
      body.classList.add(styleTemplate);

      // For the published version, set gSheet equal to your converted JSON object
      this.gSheet = cleanData;

      console.log("done fetching and cleaning data");
      this.dataReady = true;

      if (location.hostname.toString() !== "localhost") {
        this.$mixpanel.track("Visit Game Session", {
          game_name: this.customOptions.gameTitle ?? "untitled",
          session_url: location.hostname.toString() + this.$route.fullPath,
          format: "Generator",
        });
      }

      if (this.firebaseReady && this.categoryData) {
        this.shuffleAll();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>

$base-color: rgb(33, 33, 33);

.game-room {
  padding-top: 20px;
}
.generator-main {
  font-weight: bold;  
  border-radius: 5px;
}

@media (max-width: 575px) {  
  .generator-cell-body {
    font-size:1rem !important;
    font-weight: 500 !important;  
  } /*1rem = 16px*/

  .generator-cell-reroll-button {
    display: none;
  }

}

select {
  width: auto;
}

// CELL
.generator-cell {
  border-top: 1px solid rgba($base-color, 0.1);
  border-right: 0px;
  border-left: 0px;
  border-bottom: 0px;
  display: inline-flex; /* keep the inline nature of buttons */
  align-items: stretch; /* this is default */  
  font-family: inherit;
  font-size: 100%;
  background: inherit;
  color: inherit;
  transition: background-color 0.2s;
  transition: all 0.3s;  
  white-space: nowrap;
  overflow: hidden;
  outline-offset: -1px;
}

.generator-cell:not(.generator-cell-row-end) {    
  border-right: 1px solid rgba($base-color, 0.1);
}  

.generator-cell:hover {

  .generator-cell-contents {
    transform: scale(1.04);
  }

  .generator-cell-reroll-button {
    opacity: 0.5;
  }
}

.generator-cell:focus {
  outline: 1px solid rgba(255, 255, 255, 0.25);
  outline-offset: -1px;
  .generator-cell-reroll-button {
    opacity: 0.5;
  }  
}

.generator-cell-contents {
  width: 100%;
  white-space: pre-line;
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 0.3s;  
}

// CELL LABEL
.generator-cell-label {
  // background: var(--dark);
  // color: white;  
  background: var(--yellow);
  // border-bottom: 4px solid var(--dark);
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  transition: all 0.2s;
  font-size: 0.8em;
  font-weight: bold;
}

// CELL BODY
.generator-cell-body {
  flex-grow: 1;
  transition: all 0.2s;
  font-weight: 500;
}

.generator-cell-full {
  .generator-cell-body {
    font-size: 2em; 
  }
  .generator-cell-full-small {
    font-size: 1.2em;
    font-weight: 600;
  }
}


.generator-cell-one-half {
  .generator-cell-body {
    font-size: 1.1em;
    font-weight: 600;
  }
}
.generator-cell-one-third {
  .generator-cell-body {
    font-size: 1.1em;
    font-weight: 600;
  }  
}
.generator-cell-one-quarter {  
  .generator-cell-body {
    font-size: 0.9em;
    font-weight: 600;
  }
}


// CELL REROLL BUTTON
.generator-cell-reroll-button {
  margin-top: 8px;
  text-transform: uppercase;
  font-size: 0.8em;
  transition: opacity 0.25s;
  opacity: 0;
}

////////////////////////////////

.slot-machine {
  margin: auto;
  padding-top: 1em;
  padding-bottom: 1em;
}

.card-body {
  font-size: 1.5em;
  min-height: 11em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

// Reroll transition
.reroll-enter-active,
.reroll-leave-active {
  transition: all .5s;

}
.reroll-enter, .reroll-leave-to /* .fade-leave-active below version 2.1.8 */ {

  .generator-cell-label {
    // transform: scale(1.025);
    transition: transform 0.5s;
    transform: translateY(0px) scale(1.05);
  }

  .generator-cell-body {
    // transition-delay: 0.25s;
    opacity: 0;
    transform: scale(0.9);
  }

  .generator-cell-reroll-button {
    transition: transform 0.5s;
    transform: scale(1.1);
  }

  .generator-cell-reroll-icon {
    transition: transform 0.5s;
    transform: rotate(360deg)
  }

}

.reroll-list-enter-active {
  transition: all .5s;
}
.reroll-list-leave-active {
 transition: all 0s;
}

.reroll-list-enter, .reroll-list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.reroll-list-move {
  transition: transform 1s;
}

.x-card-text {
  font-size: 0.5em;
  text-decoration: underline;
}

.full-page-background {
  position: absolute;
  height: 100%;
  width: 100vw;
  top: 0;
  right: 0;
  margin: 0;
  z-index: -1;
}
</style>
