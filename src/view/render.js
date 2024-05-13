const createElement = (tagName, options = {}) => {
  const element = document.createElement(tagName);

  Object.entries(options).forEach(([key, value]) => {
    switch (key) {
      case 'textContent':
        element.textContent = value;
        break;
      case 'classList':
        element.classList.add(...value);
        break;
      case 'attributeList':
        value.forEach(([attrName, attrValue]) => element.setAttribute(attrName, attrValue));
        break;
      case 'dataSetList':
        // eslint-disable-next-line no-return-assign
        value.forEach(([dataSetKey, dataSetValue]) => element.dataset[dataSetKey] = dataSetValue);
        break;
      default:
        break;
    }
  });
  return element;
};

const renderFormElements = (elements, i18n) => {
  const head = createElement('h1', {
    textContent: i18n.t('elements.head'),
    classList: ['display-3', 'mb-0'],
  });

  const tagLine = createElement('p', {
    textContent: i18n.t('elements.tagline'),
    classList: ['lead'],
  });

  const form = createElement('form', {
    classList: ['rss-form', 'text-body'],
    attributeList: [['action', '']],
  });

  const row = createElement('div', { classList: ['row'] });
  const col = createElement('div', { classList: ['col'] });
  const div = createElement('div', { classList: ['form-floating'] });

  const input = createElement('input', {
    classList: ['form-control', 'w-100'],
    attributeList: [
      ['id', 'url-input'],
      ['autofocus', ''],
      ['required', ''],
      ['name', 'url'],
      ['aria-label', 'url'],
      ['placeholder', i18n.t('input')],
      ['autocomplete', 'off'],
    ],
  });

  const label = createElement('label', {
    textContent: i18n.t('elements.input'),
    attributeList: [['for', 'url-input']],
  });

  div.append(input, label);
  col.append(div);

  const buttonCol = createElement('div', { classList: ['col-auto'] });

  const button = createElement('button', {
    textContent: i18n.t('buttons.submitBtn'),
    classList: ['btn', 'btn-lg', 'btn-primary', 'h-100', 'px-sm-5'],
    attributeList: [['type', 'submit'], ['aria-label', 'add']],
  });

  buttonCol.append(button);
  row.append(col, buttonCol);
  form.append(row);

  const example = createElement('p', {
    textContent: i18n.t('elements.example'),
    classList: ['mt-2', 'mb-0', 'muted'],
  });

  const feedback = createElement('p', {
    classList: ['feedback', 'm0', 'position-absolute', 'small', 'text-danger'],
  });

  elements.formDiv.append(head, tagLine, form, example, feedback);
};

const renderPostsList = (state, elements, currentFeedId, i18n) => {
  const { uiState } = state;
  const { postsList } = state.feeds;
  const postsToRender = postsList.filter(({ feedId }) => feedId === currentFeedId);

  const ul = createElement('ul', {
    classList: ['list-group', 'border-0', 'rounded-0'],
  });

  const posts = postsToRender.map(({ title, link, id }) => {
    const li = createElement('li', {
      classList: [
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      ],
    });

    const aClasses = uiState.selectedPostsIds.includes(id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];

    const postLink = createElement('a', {
      textContent: title,
      classList: aClasses,
      attributeList: [
        ['href', link],
        ['id', id],
        ['target', '_blank'],
        ['rel', 'noopener noreferrer'],
      ],
    });

    const postButton = createElement('button', {
      textContent: i18n.t('buttons.viewBtn'),
      classList: ['btn', 'btn-outline-primary', 'btn-sm'],
      attributeList: [['type', 'button']],
      dataSetList: [['id', id], ['bsToggle', 'modal'], ['bsTarget', '#modal']],
    });

    li.append(postLink, postButton);
    return li;
  });
  ul.append(...posts);
  return ul;
};

const renderFeedsList = (state) => {
  const { channelList } = state.feeds;

  const ul = createElement('ul', {
    classList: ['list-group', 'border-0', 'rounded-0'],
  });

  const feeds = channelList.map(({ title, description }) => {
    const li = createElement('li', {
      classList: ['list-group-item', 'border-0', 'border-end-0'],
    });

    const feedTitle = createElement('h3', {
      textContent: title,
      classList: ['h6', 'm-0'],
    });

    const feedDescription = createElement('p', {
      textContent: description,
      classList: ['m-0', 'small', 'text-black-50'],
    });

    li.append(feedTitle, feedDescription);
    return li;
  });
  ul.append(...feeds);
  return ul;
};

const renderSuccessFeedbackElement = (elements, i18n) => {
  const currentFeedbackElement = document.querySelector('.feedback');
  currentFeedbackElement.classList.replace('text-danger', 'text-success');
  currentFeedbackElement.textContent = i18n.t('processes.loaded');
};

const renderErrorFeedBackElement = (state, elements, i18n) => {
  const { error } = state.form;

  const currentFeedBackElement = document.querySelector('.feedback');
  currentFeedBackElement.classList.add('text-danger');
  currentFeedBackElement.textContent = i18n.t(error.key);
};
const deleteFeedbackElement = () => {
  const feedback = document.querySelector('.feedback');
  if (feedback) {
    feedback.textContent = '';
  }
};

const hideModal = (elements) => {
  const { modal } = elements;
  modal.classList.replace('show', 'fade');
  modal.removeAttribute('style');
};

const showModal = (state, elements) => {
  const { selectedPostId } = state.uiState;
  const { postsList } = state.feeds;
  const {
    modal,
    modalBody,
    modalTitle,
    modalFooterLink,
  } = elements;

  const selectedPost = postsList.find(({ id }) => id === selectedPostId);

  modal.classList.replace('fade', 'show');
  modal.setAttribute('style', 'display: block');

  modalBody.textContent = selectedPost.description;
  modalTitle.textContent = selectedPost.title;
  modalFooterLink.setAttribute('href', selectedPost.link);
};

const disableFormButton = () => {
  const formButton = document.querySelector('form button');
  formButton.setAttribute('disabled', 'true');
};

export const enableFormButton = () => {
  const formButton = document.querySelector('form button');
  formButton.removeAttribute('disabled');
};

export const renderFormErrors = (state, elements, i18n) => {
  const { error } = state.form;
  const input = document.querySelector('input');

  if (error) {
    if (error.key !== 'errors.rssError') {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
    renderErrorFeedBackElement(state, elements, i18n);
  } else {
    input.classList.remove('is-invalid');
  }
};
export const renderModal = (state, elements) => {
  const { modalVisibility } = state.uiState.modal;
  return modalVisibility ? showModal(state, elements) : hideModal(elements);
};

export const renderForm = (state, elements, i18n) => {
  const { process } = state.form;
  switch (process) {
    case 'filling':
      renderFormElements(elements, i18n);
      break;
    case 'submitting':
      disableFormButton();
      break;
    case 'submitted':
      enableFormButton();
      document.querySelector('form').reset();
      break;
    case 'failed':
      enableFormButton();
      break;
    default: break;
  }
};

export const renderFeedsAndPostsLists = (state, elements, i18n) => {
  // eslint-disable-next-line
  const renderCard = (title, i18n) => {
    const card = createElement('div', {
      classList: ['card', 'border-0'],
    });

    const cardBody = createElement('div', {
      classList: ['card-body'],
    });

    const cardTitle = createElement('h2', {
      textContent: i18n.t(title),
      classList: ['card-title', 'h4'],
    });

    cardBody.append(cardTitle);
    card.append(cardBody);

    return card;
  };

  // eslint-disable-next-line
  const feedCard = renderCard('elements.feeds', i18n);
  const postCard = renderCard('elements.posts', i18n);
  // eslint-disable-next-line
  const feedsList = renderFeedsList(state);
  const postsList = state.feeds.channelList
    .map(({ id }) => renderPostsList(state, elements, id, i18n));

  elements.feedsDiv.replaceChildren(feedCard, feedsList);
  elements.postsDiv.replaceChildren(postCard, ...postsList);
};

export const render = (state, elements, i18n) => {
  const { process } = state.feeds;
  switch (process) {
    case 'loading':
      disableFormButton();
      deleteFeedbackElement();
      break;
    case 'loaded':
      document.querySelector('form').reset();
      enableFormButton();
      renderFeedsAndPostsLists(state, elements, i18n);
      renderSuccessFeedbackElement(elements, i18n);
      break;
    case 'updated':
      renderFeedsAndPostsLists(state, elements, i18n);
      break;
    default: break;
  }
};
