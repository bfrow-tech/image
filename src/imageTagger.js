import { make } from './ui';

let userEndpoint;
let imageContainer;
let overlayElement;
let uiInstance;
let addTag;
let getTags;
let removeImageTag;
let listeners;

let users = [];
const tagPosition = {};
const LINK_ICON = 'https://library.kissclipart.com/20191101/ebq/kissclipart-build-icon-chain-icon-link-icon-7ff0ec01bbee0a7b.png';

// util functions
const removeSpecialChars = (s) => {
  // eslint-disable-next-line no-useless-escape
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

const removeAllChildElements = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.firstChild.remove();
  }
};

const filterUsers = (val) =>
  users.filter((u) => {
    const matchVal = new RegExp(removeSpecialChars(val), 'i');

    return u.fullName.match(matchVal);
  });

export const addOverlay = (height, width) => {
  const overlay = make('div', 'image-overlay', {
    style: `width: ${width}px; height: ${height}px;`
  });

  listeners.on(overlay, 'click', setTagPosition, false);
  overlayElement = overlay;
  return overlay;
};

const setTagPosition = (e) => {
  e.stopPropagation();
  const { currentTarget, clientX, clientY } = e;
  let rect = currentTarget.getBoundingClientRect();

  tagPosition.top = `${Math.round(Math.floor(clientY - rect.top) / rect.height * 100)}%`;
  tagPosition.left = `${Math.round(Math.floor(clientX - rect.left) / rect.width * 100)}%`;

  const tagButtons = makeTagButtons();

  currentTarget.appendChild(tagButtons);
};

const makeTagButtons = () => {
  const buttonWrapper = make('div', 'tag-btn-wrapper');

  const buttons = ['user', 'link'].map((t) => {
    const button = make('button', 'tag-btn', { textContent: `Tag ${t}` });

    listeners.on(button, 'click', ((tagType) => {
      if (tagType == 'user') {
        return makeUserTagInput;
      }
      if (tagType == 'link') {
        return makeLinkTagInput;
      }
    })(t), false);

    return button;
  });

  buttonWrapper.append(...buttons);

  return buttonWrapper;
};

const makeTag = ({ top, left, tagType, title, thumbnail, username }) => {
  const tagContainer = make('div', 'tooltip-wrapper', {
    style: `top: ${top}; left: ${left}`
  });
  const caretIcon = make('span', 'tooltip-caret');
  const tagContent = make('div', 'tooltip-content');

  const src = tagType === 'user' ? thumbnail : LINK_ICON;
  const tagImage = make('img', null, { src });

  const tagTitle = make('a', null, {
    href: tagType === 'link' ? title : `https://bfrow.com/${username}`,
    textContent: title || username
  });

  const removeTagIcon = make('span', 'rm-tag-btn', { innerHTML: '&times;' });

  listeners.on(removeTagIcon, 'click', removeTag({ top, left }), false);
  tagContent.append(tagImage, tagTitle, removeTagIcon);
  tagContainer.append(caretIcon, tagContent);
  return tagContainer;
};

const makeLinkTagInput = (e) => {
  e.stopPropagation();
  const tagInput = make('input', 'tag-input', {
    type: 'text',
    autofocus: 'autofocus'
  });

  listeners.on(tagInput, 'keydown', ({ key }) => {
    if (key === 'Enter') {
      const tag = {
        ...tagPosition,
        tagType: 'link',
        title: tagInput.value
      };

      addTag(tag);
      renderTags();
    }
  }, false);

  // click event bubbling resets tag position
  listeners.on(tagInput, 'click', (event) => event.stopPropagation(), false);

  overlayElement.appendChild(tagInput);
};

const makeUserTagInput = (e) => {
  e.stopPropagation();
  const tagInput = make('input', 'tag-input', {
    type: 'text',
    autofocus: 'autofocus'
  });
  const dropdownContainer = make('div', 'dropdown');

  listeners.on(tagInput, 'keydown', renderDropdown(dropdownContainer), false);

  // click event bubbling resets tag position
  listeners.on(tagInput, 'click', (event) => event.stopPropagation(), false);

  overlayElement.appendChild(tagInput);
};

const renderDropdown = (dropdownWrapper) => {
  return async (e) => {
    removeAllChildElements(dropdownWrapper);
    const query = e.currentTarget.value;
    const results = userEndpoint ? await searchUsers(query) : filterUsers(query);

    const dropdownItems = results.map((u) => makeDropdownItems(u));

    dropdownWrapper.append(...dropdownItems);

    overlayElement.appendChild(dropdownWrapper);
  };
};

const makeDropdownItems = (user) => {
  const imageUrl = user.image ? user.image.small : '';
  const dropdownItem = make('li');
  const dropdownImage = make('img', 'dropdown-img', { src: imageUrl });
  const fullName = make('span', 'full-name', { textContent: user.displayName });
  const username = make('span', 'username', { textContent: user.nickname });

  dropdownItem.append(dropdownImage, fullName, username);
  listeners.on(dropdownItem, 'click', selectUser(user), false);

  return dropdownItem;
};

const selectUser = ({ displayName, nickname, image }) => (e) => {
  e.stopPropagation();
  const imageUrl = image ? image.small : '';
  const tag = {
    ...tagPosition,
    tagType: 'user',
    title: displayName,
    username: nickname,
    thumbnail: imageUrl
  };

  addTag(tag);
  renderTags();
};

const removeTag = (position) => {
  return (e) => {
    e.stopPropagation();
    removeImageTag(position);
    e.currentTarget.parentElement.parentElement.remove();
  };
};

const renderTags = () => {
  const tags = getTags();
  const tagElements = tags.map((t) => makeTag(t));

  imageContainer.append(...tagElements);

  if (overlayElement) {
    overlayElement.remove();
  }
};

const toggleTagsDisplay = (e) => {
  const displayedTags = e.currentTarget.querySelectorAll('.tooltip-wrapper');

  displayedTags.forEach((t) =>
    t.classList.toggle('no-display', !t.classList.contains('no-display'))
  );
};

const searchUsers = async (searchValue) => {
  try {
    const endpoint = `${userEndpoint}?query=${searchValue}&limit=10&page=1`;
    const { result: { data } } = await fetch(endpoint).then(res => res.json());

    return data;
  } catch (error) {
    return error;
  }
};

export const startImageTagging = () => {
  if (uiInstance.currentStatus === 'FILLED') {
    const hasOverlay = !!imageContainer.querySelector('.image-overlay');

    if (hasOverlay) {
      overlayElement.remove();
    } else {
      const { height, width } = imageContainer.querySelector('.image-tool__image-picture');
      const tagOverlay = addOverlay(height, width);

      imageContainer.appendChild(tagOverlay);
    }
  }
};

const removeOverlay = () => {
  if (overlayElement) overlayElement.remove();
};

export const initImageTagging = (options) => {
  imageContainer = options.uiInstance.nodes.imageContainer;
  uiInstance = options.uiInstance;
  users = options.users.data || [];
  userEndpoint = options.users.endpoint;
  addTag = options.addTag;
  getTags = options.getTags;
  removeImageTag = options.removeImageTag;
  listeners = options.listeners;

  listeners.on(imageContainer, 'dblclick', removeOverlay);
  listeners.on(imageContainer, 'click', toggleTagsDisplay);

  const tags = getTags() || [];

  if (tags.length > 0) {
    renderTags();
  }
};
