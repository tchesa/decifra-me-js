const wait = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

class MainMenu {
  private isLevelsOpen: boolean;
  private isSoundOn: boolean;

  constructor() {
    this.isLevelsOpen = false;
    this.isSoundOn = true;
    this.toggleSound();
  }

  toggleSound = () => {
    const value = !this.isSoundOn;

    this.isSoundOn = value;
    const soundButtonTexts = document.querySelectorAll(
      "#sound-btn .text, #sound-btn .title-main"
    );
    soundButtonTexts.forEach((element) => {
      if (element) {
        element.innerHTML = `sound: ${!value ? "on" : "off"}`;
      }
    });
  };

  toggleLevels = () => {
    if (this.isLevelsOpen) {
      this.hideLevels();
    } else {
      this.showLevels();
    }
  };

  private showLevels = async () => {
    this.isLevelsOpen = true;
    this.toggleLevelsContainer(false);
    await this.showMenus(false);
  };

  private hideLevels = async () => {
    this.isLevelsOpen = false;
    this.toggleLevelsContainer(true);
    // await wait(0.5);
    this.showMenus(true);
  };

  private showMenus = async (show: boolean) => {
    const toggleHideClass = (element: HTMLElement | null, value: boolean) => {
      if (!element) return;

      if (value) {
        element.classList.remove("hide");
      } else {
        element.classList.add("hide");
      }
    };

    const toggleDisabledClass = (element: Element | null, value: boolean) => {
      if (!element) return;

      if (value) {
        element.classList.add("disabled");
      } else {
        element.classList.remove("disabled");
      }
    };

    if (!show) {
      document
        .querySelectorAll("#title, .buttons-container")
        .forEach((element) => {
          toggleDisabledClass(element, true);
        });
    }

    toggleHideClass(document.getElementById("title"), show);
    await wait(100);

    toggleHideClass(document.getElementById("levels-btn"), show);
    await wait(100);

    toggleHideClass(document.getElementById("sound-btn"), show);
    await wait(100);

    toggleHideClass(document.getElementById("credits-btn"), show);

    if (show) {
      document
        .querySelectorAll("#title, .buttons-container")
        .forEach((element) => {
          toggleDisabledClass(element, false);
        });
    }
  };

  private toggleLevelsContainer = (value: boolean) => {
    const levelsElement = document.getElementById("levels");

    if (levelsElement) {
      if (value) {
        levelsElement.classList.add("hide");
      } else {
        levelsElement.classList.remove("hide");
      }
    }
  };
}

const menuController = new MainMenu();

function toggleSound() {
  menuController.toggleSound();
}

function toggleLevels() {
  menuController.toggleLevels();
}
