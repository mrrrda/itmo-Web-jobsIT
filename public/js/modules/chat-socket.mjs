/* eslint-disable max-len */
import { ElementsIds } from './constants.mjs';
import { FormParser, FormValidation, FormValidationRule } from './form-utils/index.mjs';

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const form = document.getElementById(ElementsIds.chatForm);

const chatMessages = document.getElementById('chat-messages');
const chatButton = document.getElementById('chat-button');
const chatBox = document.getElementById('chat-box');
const messageElement = document.getElementById('message-notification');

const PERSONAL_EMAIL_FIELD = 'personal-email';
const RECEPIENT_FIELD = 'recipient';
const MESSAGE_FIELD = 'message';

const formValidationSchema = {
  [RECEPIENT_FIELD]: new FormValidationRule(RECEPIENT_FIELD)
    .string()
    .required('Recipient is required')
    .matches(EMAIL_REGEX, 'Invalid email'),
  [MESSAGE_FIELD]: new FormValidationRule(MESSAGE_FIELD)
    .string()
    .minLength(1, 'Message cannot be empty')
    .maxLength(200, 'The message length must not exceed 200 characters'),
};

const personalEmail = FormParser.getTextValue(form, PERSONAL_EMAIL_FIELD);
const socket = io(`${location.origin}/chat`, { query: { email: personalEmail } });

form.addEventListener('submit', event => {
  event.preventDefault();

  const formValues = {
    [RECEPIENT_FIELD]: FormParser.getTextValue(form, RECEPIENT_FIELD).trim(),
    [MESSAGE_FIELD]: FormParser.getTextValue(form, MESSAGE_FIELD).trim(),
  };

  const validationResult = FormValidation.validate(formValues, formValidationSchema);

  for (const formKey in formValues) {
    const errors = validationResult[formKey];
    const errorMessageBox = document.querySelector(
      `[data-input-name=${formKey}] > .input__error-message`,
    );

    if (errors && errorMessageBox) {
      errorMessageBox.classList.remove('input__error-message_hidden');
      errorMessageBox.textContent = errors[errors.length - 1];
    } else if (errorMessageBox) {
      errorMessageBox.classList.add('input__error-message_hidden');
      errorMessageBox.textContent = '';
    }
  }

  if (Object.keys(validationResult).length > 0) {
    return;
  }

  const data = {
    from: personalEmail,
    to: formValues[RECEPIENT_FIELD],
    message: formValues[MESSAGE_FIELD],
    date: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };

  socket.emit('message', data);
});

socket.on('message-success', data => {
  form[RECEPIENT_FIELD].disabled = true;
  form[MESSAGE_FIELD].value = '';

  chatMessages.innerHTML += createMessage(data, true);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('chat-error', data => {
  const errorMessageBox = document.querySelector(
    `[data-input-name=recipient] > .input__error-message`,
  );
  errorMessageBox.classList.remove('input__error-message_hidden');
  errorMessageBox.textContent = data;
});

socket.on('message', data => {
  const errorMessages = document.querySelectorAll('.input__error-message');
  errorMessages.forEach(errorMessage => {
    errorMessage.classList.add('input__error-message_hidden');
  });

  const chatClosed = chatBox.classList.contains('chat-box_hidden');

  if (chatClosed) {
    messageElement.classList.remove('chat-button__message-notification_hidden');
  }

  form[RECEPIENT_FIELD].disabled = true;
  form[RECEPIENT_FIELD].value = data.from;

  chatMessages.innerHTML += createMessage(data, false);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

const createMessage = (data, isOwnMessage) => {
  return `<div class="chat-box__message-container flex flex_column flex_gap_m flex_align_center flex_justify_center ${isOwnMessage ? 'flex_align-self_end' : 'flex_align-self_start'}">
    <div class="chat-box__message ${isOwnMessage ? 'flex_align-self_end' : 'flex_align-self_start'}">
      <p class="text text_color_primary-light text_font-weight_light text_font-size_s">${data.message}</p>
    </div>
    <div class="chat-box__message flex_align-self_end">
      <p class="text text_color_secondary-dark text_font-weight_light text_font-size_s">${data.date}</p>
    </div>
  </div>`;
};

const _setupListeners = () => {
  chatButton.addEventListener('click', function (event) {
    chatBox.classList.toggle('chat-box_hidden');
    messageElement.classList.add('chat-button__message-notification_hidden');
  });

  document.addEventListener('click', function (event) {
    if (!chatBox.contains(event.target) && !chatButton.contains(event.target)) {
      chatBox.classList.add('chat-box_hidden');
    }
  });
};

_setupListeners();
