import { make } from './ui';
import LINK_ICON from './svg/link.svg';
import USER_ICON from './svg/user.svg';

// let userEndpoint;
// let imageContainer;
// let overlayElement;
// let uiInstance;
// let addTag;
// let getTags;
// let removeImageTag;
// let listeners;

// let users = [];
// const tagPosition = {};

// // util functions
const removeSpecialChars = (s) => {
  // eslint-disable-next-line no-useless-escape
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const removeAllChildElements = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.firstChild.remove();
  }
};

// const filterUsers = (val) =>
//   users.filter((u) => {
//     const matchVal = new RegExp(removeSpecialChars(val), 'i');

//     return u.fullName.match(matchVal);
//   });

// export const addOverlay = (height, width) => {
//   const overlay = make('div', 'image-overlay', {
//     style: `width: ${width}px; height: ${height}px;`,
//   });

//   listeners.on(overlay, 'click', setTagPosition, false);
//   overlayElement = overlay;
//   return overlay;
// };

// const setTagPosition = (e) => {
//   e.stopPropagation();
//   const { currentTarget, clientX, clientY } = e;
//   let rect = currentTarget.getBoundingClientRect();

//   tagPosition.top = `${Math.round(
//     (Math.floor(clientY - rect.top) / rect.height) * 100
//   )}%`;
//   tagPosition.left = `${Math.round(
//     (Math.floor(clientX - rect.left) / rect.width) * 100
//   )}%`;

//   const tagButtons = makeTagButtons();

//   currentTarget.appendChild(tagButtons);
// };

// const makeTagButtons = () => {
//   const buttonWrapper = make('div', 'tag-btn-wrapper');

//   const buttons = ['user', 'link'].map((t) => {
//     const button = make('button', 'tag-btn', { textContent: `Tag ${t}` });

//     listeners.on(
//       button,
//       'click',
//       ((tagType) => {
//         if (tagType == 'user') {
//           return makeUserTagInput;
//         }
//         if (tagType == 'link') {
//           return makeLinkTagInput;
//         }
//       })(t),
//       false
//     );

//     return button;
//   });

//   buttonWrapper.append(...buttons);

//   return buttonWrapper;
// };

// const createTagImage = (tagType, imageUrl) => {
//   if (tagType === 'user') {
//     const tagImage =
//       typeof imageUrl === 'string'
//         ? make('img', null, { src: imageUrl })
//         : make('span', null, { innerHTML: USER_ICON });

//     return tagImage;
//   }

//   if (tagType === 'link') {
//     return make('span', null, { innerHTML: LINK_ICON });
//   }
// };

// const makeTag = ({ top, left, tagType, title, thumbnail, username }) => {
//   const tagContainer = make('div', 'tooltip-wrapper', {
//     style: `top: ${top}; left: ${left}`,
//   });
//   const caretIcon = make('span', 'tooltip-caret');
//   const tagContent = make('div', 'tooltip-content');
//   const tagImage = createTagImage(tagType, thumbnail);

//   const tagTitle = make('a', null, {
//     href: tagType === 'link' ? title : `https://bfrow.com/user/${username}`,
//     textContent: title || username,
//     target: '_blank',
//   });

//   const removeTagIcon = make('span', 'rm-tag-btn', { innerHTML: '&times;' });

//   listeners.on(removeTagIcon, 'click', removeTag({ top, left }), false);
//   tagContent.append(tagImage, tagTitle, removeTagIcon);
//   tagContainer.append(caretIcon, tagContent);
//   return tagContainer;
// };

// const makeLinkTagInput = (e) => {
//   e.stopPropagation();
//   const tagInput = make('input', 'tag-input', {
//     type: 'text',
//     autofocus: 'autofocus',
//   });

//   listeners.on(
//     tagInput,
//     'keydown',
//     ({ key }) => {
//       if (key === 'Enter') {
//         const tag = {
//           ...tagPosition,
//           tagType: 'link',
//           title: tagInput.value,
//         };

//         addTag(tag);
//         renderTags();
//       }
//     },
//     false
//   );

//   // click event bubbling resets tag position
//   listeners.on(tagInput, 'click', (event) => event.stopPropagation(), false);

//   overlayElement.appendChild(tagInput);
// };

// const makeUserTagInput = (e) => {
//   e.stopPropagation();
//   const tagInput = make('input', 'tag-input', {
//     type: 'text',
//     autofocus: 'autofocus',
//   });
//   const dropdownContainer = make('div', 'dropdown');

//   listeners.on(tagInput, 'keydown', renderDropdown(dropdownContainer), false);

//   // click event bubbling resets tag position
//   listeners.on(tagInput, 'click', (event) => event.stopPropagation(), false);

//   overlayElement.appendChild(tagInput);
// };

// const renderDropdown = (dropdownWrapper) => {
//   return async (e) => {
//     removeAllChildElements(dropdownWrapper);
//     const query = e.currentTarget.value;
//     const results = userEndpoint
//       ? await searchUsers(query)
//       : filterUsers(query);

//     const dropdownItems = results.map((u) => makeDropdownItems(u));

//     dropdownWrapper.append(...dropdownItems);

//     overlayElement.appendChild(dropdownWrapper);
//   };
// };

// const makeDropdownItems = (user) => {
//   const imageUrl = user.image ? user.image.small : '';
//   const dropdownItem = make('li');
//   const dropdownImage = make('img', 'dropdown-img', { src: imageUrl });
//   const fullName = make('span', 'full-name', { textContent: user.displayName });
//   const username = make('span', 'username', { textContent: user.nickname });

//   dropdownItem.append(dropdownImage, fullName, username);
//   listeners.on(dropdownItem, 'click', selectUser(user), false);

//   return dropdownItem;
// };

// const selectUser = ({ displayName, nickname, image }) => (e) => {
//   e.stopPropagation();
//   const imageUrl = image ? image.small : '';
//   const tag = {
//     ...tagPosition,
//     tagType: 'user',
//     title: displayName,
//     username: nickname,
//     thumbnail: imageUrl,
//   };

//   addTag(tag);
//   renderTags();
// };

// const removeTag = (position) => {
//   return (e) => {
//     e.stopPropagation();
//     removeImageTag(position);
//     e.currentTarget.parentElement.parentElement.remove();
//   };
// };

// const renderTags = () => {
//   const tags = getTags();
//   const tagElements = tags.map((t) => makeTag(t));

//   imageContainer.append(...tagElements);

//   if (overlayElement) {
//     overlayElement.remove();
//   }
// };

// const toggleTagsDisplay = (e) => {
//   const displayedTags = e.currentTarget.querySelectorAll('.tooltip-wrapper');

//   displayedTags.forEach((t) =>
//     t.classList.toggle('no-display', !t.classList.contains('no-display'))
//   );
// };

// const searchUsers = async (searchValue) => {
//   try {
//     const endpoint = `${userEndpoint}?query=${searchValue}&limit=10&page=1`;
//     const {
//       result: { data },
//     } = await fetch(endpoint).then((res) => res.json());

//     return data;
//   } catch (error) {
//     return error;
//   }
// };

// export const startImageTagging = () => {
//   if (uiInstance.currentStatus === 'FILLED') {
//     const hasOverlay = !!imageContainer.querySelector('.image-overlay');

//     if (hasOverlay) {
//       overlayElement.remove();
//     } else {
//       const { height, width } = imageContainer.querySelector(
//         '.image-tool__image-picture'
//       );
//       const tagOverlay = addOverlay(height, width);

//       imageContainer.appendChild(tagOverlay);
//     }
//   }
// };

// const removeOverlay = () => {
//   if (overlayElement) overlayElement.remove();
// };

// export const initImageTagging = (options) => {
//   imageContainer = options.uiInstance.nodes.imageContainer;
//   uiInstance = options.uiInstance;
//   users = options.users.data || [];
//   userEndpoint = options.users.endpoint;
//   addTag = options.addTag;
//   getTags = options.getTags;
//   removeImageTag = options.removeImageTag;
//   listeners = options.listeners;

//   const image = imageContainer.querySelector('.image-tool__image-picture');

//   listeners.on(imageContainer, 'dblclick', removeOverlay);
//   listeners.on(imageContainer, 'click', toggleTagsDisplay);

//   // if (image) listeners.on(image, 'mouseenter', onMouseOver);
//   // listeners.on(imageContainer, 'mouseenter', onMouseOver);
//   // listeners.on(imageContainer, 'mouseleave', () => {
//   //   const buttonOverlay = imageContainer.querySelector('.button-overlay');

//   //   if (buttonOverlay) buttonOverlay.remove();
//   // });

//   /**
//    * 1. Add a hover effect on imageContainer or the image itself
//    * 2. Show tag buttons on hover of image
//    * 3. onClick of any tag buttons allows user to set tag position
//    * 4. normal tagging process continues...
//    */

//   const tags = getTags() || [];

//   if (tags.length > 0) {
//     renderTags();
//   }
// };

// const onMouseOver = (e) => {
//   const tagButtons = makeTagButtons();
//   const buttonOverlay = make('div', 'button-overlay', {
//     style: `
//       width: ${e.target.width}px;
//       height: ${e.target.height}px;
//     `,
//   });

//   buttonOverlay.appendChild(tagButtons);
//   imageContainer.appendChild(buttonOverlay);
// };

/**
 * Image tagging
 */
export class ImageTagging {
  /**
   * @param {object} ui - ui instance
   * @param {object} users - users data
   * @param {object} listeners - Editorjs api for event listeners
   * @param {function} addTag - callback for adding a tag
   * @param {function} getTag - callback for getting a tag
   * @param {function} removeTag - callback for removing a tag
   */
  constructor({ ui, users, listeners, addTag, getTags, removeImageTag }) {
    this.ui = ui;
    this.users = users.data || [];
    this.listeners = listeners;
    this.addTag = addTag;
    this.getTags = getTags;
    this.removeTag = removeImageTag;

    this.imageContainer = this.ui.nodes.imageContainer;
    this.userEndpoint = users.endpoint;
    this.tagPositions = {
      top: 0,
      left: 0
    };

    this.listeners.on(this.imageContainer, 'dblclick', this.removeOverlay);
    this.listeners.on(this.imageContainer, 'click', this.toggleTagsDisplay);

    const tags = this.getTags() || [];

    if (tags.length > 0) {
      this.renderTags();
    }
  }

  /**
   * start tagging process
   */
  startImageTagging() {
    if (this.ui.currentStatus === 'FILLED') {
      const hasOverlay = !!this.imageContainer.querySelector('.image-overlay');

      if (hasOverlay) {
        this.overlayElement.remove();
      } else {
        const { height, width } = this.imageContainer.querySelector(
          '.image-tool__image-picture'
        );
        const tagOverlay = this.addOverlay(height, width);

        this.imageContainer.appendChild(tagOverlay);
      }
    }
  }

  /**
   * make tag buttons
   */
  makeTagButtons() {
    const buttonWrapper = make('div', 'tag-btn-wrapper');
    const buttons = ['user', 'link'].map((t) => {
      const button = make('button', 'tag-btn', { textContent: `Tag ${t}` });

      this.listeners.on(
        button,
        'click',
        ((tagType) => {
          if (tagType == 'user') {
            return this.makeUserTagInput.bind(this);
          }
          if (tagType == 'link') {
            return this.makeLinkTagInput.bind(this);
          }
        })(t),
        false
      );

      return button;
    });

    buttonWrapper.append(...buttons);
    return buttonWrapper;
  }

  /** Make link tag input */
  makeLinkTagInput(e) {
    e.stopPropagation();
    const tagInput = make('input', 'tag-input', {
      type: 'text',
      autofocus: 'autofocus'
    });

    this.listeners.on(
      tagInput,
      'keydown',
      ({ key }) => {
        if (key === 'Enter') {
          const tag = {
            ...this.tagPositions,
            tagType: 'link',
            title: tagInput.value
          };

          this.addTag(tag);
          this.renderTags();
        }
      },
      false
    );

    // click event bubbling resets tag position
    this.listeners.on(tagInput, 'click', (event) => event.stopPropagation(), false);

    this.overlayElement.appendChild(tagInput);
  };

  /** Make user tag input */
  makeUserTagInput(e) {
    e.stopPropagation();
    const tagInput = make('input', 'tag-input', {
      type: 'text',
      autofocus: 'autofocus'
    });
    const dropdownContainer = make('div', 'dropdown');

    this.listeners.on(tagInput, 'keydown', this.renderDropdown(dropdownContainer).bind(this), false);
    // click event bubbling resets tag position
    this.listeners.on(tagInput, 'click', (event) => event.stopPropagation(), false);

    this.overlayElement.appendChild(tagInput);
  };

  /** set tag postions */
  setTagPosition(e) {
    e.stopPropagation();
    const { currentTarget, clientX, clientY } = e;
    let rect = currentTarget.getBoundingClientRect();

    this.tagPositions.top = `${Math.round(
      (Math.floor(clientY - rect.top) / rect.height) * 100
    )}%`;
    this.tagPositions.left = `${Math.round(
      (Math.floor(clientX - rect.left) / rect.width) * 100
    )}%`;

    const tagButtons = this.makeTagButtons();

    currentTarget.appendChild(tagButtons);
  };

  /** removeOverlay */
  removeOverlay() {
    if (this.overlayElement) this.overlayElement.remove();
  };

  /** toggleTagsDisplay */
  toggleTagsDisplay(e) {
    const displayedTags = e.currentTarget.querySelectorAll('.tooltip-wrapper');

    displayedTags.forEach((t) =>
      t.classList.toggle('no-display', !t.classList.contains('no-display'))
    );
  };

  /** add overlay */
  addOverlay(height, width) {
    const overlay = make('div', 'image-overlay', {
      style: `width: ${width}px; height: ${height}px;`
    });

    this.listeners.on(overlay, 'click', this.setTagPosition.bind(this), false);
    this.overlayElement = overlay;
    return overlay;
  };

  /** make tag */
  makeTag({ top, left, tagType, title, thumbnail, username }) {
    const tagContainer = make('div', 'tooltip-wrapper', {
      style: `top: ${top}; left: ${left}`
    });
    const caretIcon = make('span', 'tooltip-caret');
    const tagContent = make('div', 'tooltip-content');
    const tagImage = this.createTagImage(tagType, thumbnail);

    const tagTitle = make('a', null, {
      href: tagType === 'link' ? title : `https://bfrow.com/user/${username}`,
      textContent: title || username,
      target: '_blank'
    });

    const removeTagIcon = make('span', 'rm-tag-btn', { innerHTML: '&times;' });

    this.listeners.on(removeTagIcon, 'click', this.removeTag({ top, left }), false);
    tagContent.append(tagImage, tagTitle, removeTagIcon);
    tagContainer.append(caretIcon, tagContent);
    return tagContainer;
  }

  /**  create tag image */
  createTagImage(tagType, imageUrl) {
    if (tagType === 'user') {
      const tagImage =
       imageUrl && typeof imageUrl === 'string'
         ? make('img', null, { src: imageUrl })
         : make('span', null, { innerHTML: USER_ICON });

      return tagImage;
    }

    if (tagType === 'link') {
      return make('span', null, { innerHTML: LINK_ICON });
    }
  }

  /** filter users */
  filterUsers(val) {
    return this.users.filter((u) => {
      const matchVal = new RegExp(removeSpecialChars(val), 'i');

      return u.fullName.match(matchVal);
    });
  }

  /** search users */
  async searchUsers(searchValue) {
    try {
      const endpoint = `${this.userEndpoint}?query=${searchValue}&limit=10&page=1`;
      const {
        result: { data }
      } = await fetch(endpoint).then((res) => res.json());

      return data;
    } catch (error) {
      return error;
    }
  }

  /** select user */
  selectUser({ displayName, nickname, image }) {
    return (e) => {
      e.stopPropagation();
      const imageUrl = image ? image.small : '';
      const tag = {
        ...this.tagPositions,
        tagType: 'user',
        title: displayName,
        username: nickname,
        thumbnail: imageUrl
      };

      this.addTag(tag);
      this.renderTags();
    };
  }

  /** render drop down */
  renderDropdown(dropdownWrapper) {
    return async (e) => {
      removeAllChildElements(dropdownWrapper);
      const query = e.currentTarget.value;
      const results = this.userEndpoint
        ? await this.searchUsers(query)
        : this.filterUsers(query);
      const dropdownItems = results.map((u) => this.makeDropdownItems(u));

      dropdownWrapper.append(...dropdownItems);
      this.overlayElement.appendChild(dropdownWrapper);
    };
  };

  /** make dropdown item */
  makeDropdownItems(user) {
    const imageUrl = user.image ? user.image.small : '';
    const dropdownItem = make('li');
    const dropdownImage = imageUrl
      ? make('img', null, { src: imageUrl })
      : make('span', 'dropdown-img', { innerHTML: USER_ICON });
    const fullName = make('span', 'full-name', { textContent: user.displayName });
    const username = make('span', 'username', { textContent: user.nickname });

    dropdownItem.append(dropdownImage, fullName, username);
    this.listeners.on(dropdownItem, 'click', this.selectUser(user), false);

    return dropdownItem;
  }

  /** render tags */
  renderTags() {
    const tags = this.getTags();
    const tagElements = tags.map((t) => this.makeTag(t));

    this.imageContainer.append(...tagElements);

    if (this.overlayElement) {
      this.overlayElement.remove();
    }
  };
}
