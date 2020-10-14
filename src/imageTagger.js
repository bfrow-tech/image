/**
 * startTaggingProcess
 * addImageOverlay
 *  - set overlay height and width to current image height and width
 *  - append overlay to the main image wrapper
 *  - add click event to overlay for selecting tag positions (fires a setTagPosition function)
 * setTagPosition
 *  - get top and left postion of mouse with getBoundingClientRect API
 *  - render buttons for selecting they type of tag (Tag User/Tag Link)
 * renderTagTypeBtns
 *  - Tag user button
 *  - Tag link button
 *  - Each button with a click event that renders an input specific to each selections
 * renderTagInput
 *  - create and append a text input into overlay wrapper element
 *  - create a dropdown element and make it hidden by default
 *  - add keydown event to text input
 *  - if type of tag is "user" make dropdown visible
 *  - remove existing dropdown child elements
 *  - filter users array based on the input value (use regex to match and sanitize input value)
 *  - map through filtered result and display child list elements of the dropdown
 *  - add click event to each list child element of the dropdown fire createUserTag
 *  - if type of tag is link fire createLinkTag function
 *  - if user hits enter fire createUserTag or createLinkTag depending on the type of tag
 * createUserTag
 *  - creates a tag object comprised of:
 *      - username
 *      - user's profile photo
 *      - selected postion
 *      - type of tag (user/link)
 *  - renders tag with created tag object (fires renderTag method)
 * createLinkTag
 *  - creates a tag object comprised of:
 *      - title
 *      - link icon
 *      - selected postion
 *      - type of tag (link)
 *  - renders tag with created tag object (fires renderTag method)
 * renderTag
 *  - make an array of created tooltip tag Elements
 *  - create a tooltip ui element
 *  - set top and left postion to tag object top and left postion values
 *  - push tooltip element to tagElements array
 *  - remove no-display css class from all created tag elements
 *
 * toggleTagsDisplay
 *  - on click of image show/hide tags
 * removeTags
 *  - deletes tag
 */

import { make } from './ui';

const users = [];
const tagPosition = {};
let tags = [];

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

export const addOverlay = (height, width) => {
  const overlay = make('div', 'image-overlay', {
    style: `width: ${width}px; height: ${height}px;`
  });

  overlay.addEventListener('click', setTagPosition);

  return overlay;
};

const setTagPosition = (e) => {
  e.stopPropagation();
  const { currentTarget, clientX, clientY } = e;
  let rect = currentTarget.getBoundingClientRect();

  console.log(parseInt(currentTarget.style.width, 10));
  console.log(Math.floor(clientX - rect.left));
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
  // button -> buttonWrapper -> overlay
  const overlayElement = e.currentTarget.parentElement.parentElement;

  tagInput.addEventListener('keydown', ({ key }) => {
    if (key === 'Enter') {
      const currentTag = {
        ...tagPosition,
        tagType: 'link',
        title: tagInput.value
      };

      tags.push(currentTag);
      console.log({ tags });
      renderTags(overlayElement);
    }
  });

  // click event bubbling resets tag position
  tagInput.addEventListener('click', (event) => event.stopPropagation());

  // append to overlay el
  overlayElement.appendChild(tagInput);
};

const filterUsers = (val) =>
  users.filter((u) => {
    const matchVal = new RegExp(removeSpecialChars(val), 'i');

    return u.fullName.match(matchVal);
  });

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

  return tagInput;
};

const renderDropdown = (dropdownWrapper) => {
  return (e) => {
    removeAllChildElements(dropdownWrapper);

    const filteredUsers = filterUsers(e.currentTarget.value);
    const dropdownItems = filteredUsers.map((u) => makeDropdownItems(u));

    dropdownWrapper.append(...dropdownItems);
  };
};

const makeDropdownItems = (user) => {
  const dropdownItem = make('li');
  const dropdownImage = make('img', 'dropdown-img', { src: user.thumbnail });
  const fullName = make('span', 'full-name', { textContent: user.fullName });
  const username = make('span', 'username', { textContent: user.username });

  dropdownItem.append(dropdownImage, fullName, username);
  dropdownItem.addEventListener('click', selectUser);

  return dropdownItem;
};

const selectUser = (e) => {
  e.stopPropagation();
  const { querySelector } = e.currentTarget;
  const fullName = querySelector('.full-name').innerText;
  const username = querySelector('.username').innerText;
  const thumbnail = querySelector('img').src;

  const currentTag = {
    top: 20, // hardcoded for now
    left: 80, // hardcoded for now
    tagType: 'user',
    title: fullName,
    thumbnail,
    username
  };

  renderTags(currentTag);
};

const removeTag = (id) => {
  tags = tags.filter((t) => t.id !== id);
  return (e) => {
    e.stopPropagation();
    e.currentTarget.parentElement.parentElement.remove();
  };
};

const renderTags = (overlay) => {
  const tagElements = tags.map((t) => makeTag(t));

  overlay.parentElement.append(...tagElements);
  overlay.remove();
};

export const getTags = () => tags;

export const toggleTagsDisplay = (currentTags) => (e) => {
  const displayedTags = e.currentTarget.querySelectorAll('.tooltip-wrapper');

  displayedTags.forEach((t) =>
    t.classList.toggle('no-display', !t.classList.contains('no-display'))
  );
};
