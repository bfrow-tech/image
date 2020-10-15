import { make } from './ui';

let users = [];
let userEndpoint;
const tagPosition = {};
let tags = [];
let overlayElement;

const removeAllChildElements = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.firstChild.remove();
  }
};

export const addOverlay = (height, width) => {
  const overlay = make('div', 'image-overlay', {
    style: `width: ${width}px; height: ${height}px;`
  });

  overlay.addEventListener('click', setTagPosition);
  overlayElement = overlay;
  return overlay;
};

const setTagPosition = (e) => {
  e.stopPropagation();
  const { currentTarget, clientX, clientY } = e;
  let rect = currentTarget.getBoundingClientRect();

  // console.log(parseInt(currentTarget.style.width, 10));
  // console.log(Math.floor(clientX - rect.left));
  tagPosition.top = Math.floor(clientY - rect.top);
  tagPosition.left = Math.floor(clientX - rect.left);

  const tagButtons = makeTagButtons();

  currentTarget.appendChild(tagButtons);
};

const makeTagButtons = () => {
  const buttonWrapper = make('div', 'tag-btn-wrapper');

  const buttons = ['user', 'link'].map((t) => {
    const button = make('button', 'tag-btn', { textContent: `Tag ${t}` });

    button.addEventListener(
      'click',
      ((tagType) => {
        if (tagType == 'user') {
          return makeUserTagInput;
        }
        if (tagType == 'link') {
          return makeLinkTagInput;
        }
      })(t)
    );
    return button;
  });

  buttonWrapper.append(...buttons);

  return buttonWrapper;
};

const makeTag = ({ id, top, left, tagType, title, thumbnail, username }) => {
  const tagContainer = make('div', 'tooltip-wrapper', {
    style: `top: ${top}px; left: ${left}px`
  });
  const caretIcon = make('span', 'tooltip-caret');
  const tagContent = make('div', 'tooltip-content');

  const src =
    thumbnail ||
    'https://library.kissclipart.com/20191101/ebq/kissclipart-build-icon-chain-icon-link-icon-7ff0ec01bbee0a7b.png';
  const tagImage = make('img', null, { src });

  const tagTitle = make('a', null, {
    href: tagType === 'link' ? title : `https://bfrow.com/${username}`,
    textContent: title || username
  });

  const removeTagIcon = make('span', 'rm-tag-btn', { innerHTML: '&times;' });

  removeTagIcon.addEventListener('click', removeTag(id));
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

  tagInput.addEventListener('keydown', ({ key }) => {
    if (key === 'Enter') {
      const currentTag = {
        ...tagPosition,
        tagType: 'link',
        title: tagInput.value
      };

      tags.push(currentTag);
      renderTags();
    }
  });

  // click event bubbling resets tag position
  tagInput.addEventListener('click', (event) => event.stopPropagation());

  overlayElement.appendChild(tagInput);
};

const makeUserTagInput = (e) => {
  e.stopPropagation();
  const tagInput = make('input', 'tag-input', {
    type: 'text',
    autofocus: 'autofocus'
  });
  const dropdown = make('div', 'dropdown');

  tagInput.addEventListener('keydown', renderDropdown(dropdown));

  // click event bubbling resets tag position
  tagInput.addEventListener('click', (event) => event.stopPropagation());

  overlayElement.appendChild(tagInput);
};

const renderDropdown = (dropdownWrapper) => {
  return async (e) => {
    removeAllChildElements(dropdownWrapper);
    const results = await searchUsers(e.currentTarget.value);

    const dropdownItems = results.map((u) => makeDropdownItems(u));

    dropdownWrapper.append(...dropdownItems);

    overlayElement.appendChild(dropdownWrapper);
  };
};

const makeDropdownItems = (user) => {
  const src = user.image ? user.image.small : '';
  const dropdownItem = make('li');
  const dropdownImage = make('img', 'dropdown-img', { src });
  const fullName = make('span', 'full-name', { textContent: user.displayName });
  const username = make('span', 'username', { textContent: user.nickname });

  dropdownItem.append(dropdownImage, fullName, username);
  dropdownItem.addEventListener('click', selectUser(user));

  return dropdownItem;
};

const selectUser = ({ displayName, nickname, image }) => (e) => {
  e.stopPropagation();
  const tag = {
    ...tagPosition,
    tagType: 'user',
    title: displayName,
    username: nickname,
    thumbnail: image.small
  };

  tags.push(tag);
  renderTags(overlayElement);
};

const removeTag = (id) => {
  tags = tags.filter((t) => t.id !== id);
  return (e) => {
    e.stopPropagation();
    e.currentTarget.parentElement.parentElement.remove();
  };
};

const renderTags = () => {
  const tagElements = tags.map((t) => makeTag(t));

  overlayElement.parentElement.append(...tagElements);
  overlayElement.remove();
};

export const getTags = () => tags;

export const toggleTagsDisplay = (currentTags) => (e) => {
  const displayedTags = e.currentTarget.querySelectorAll('.tooltip-wrapper');

  displayedTags.forEach((t) =>
    t.classList.toggle('no-display', !t.classList.contains('no-display'))
  );
};

export const initializeUserData = (u) => {
  userEndpoint = u.endpoint;
  users = u.data;
};

const searchUsers = async (searchValue) => {
  const endpoint = `${userEndpoint}?query=${searchValue}&limit=10&page=1`;
  const { result: { data } } = await fetch(endpoint).then(res => res.json());

  return data;
};
