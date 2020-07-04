import request from '@/utils/request';

function closeShare(shareId) {
  request.put(`/api/shares/${shareId}/close`, null, () => {});
}

function startShare(shareId) {
  request.put(`/api/shares/${shareId}/contents/start`, null, () => {});
}

function stopShare(shareId) {
  request.put(`/api/shares/${shareId}/contents/stop`, null, () => {});
}

function kickOutUser(shareId, userId) {
  request.put(`/api/shares/${shareId}/contents/users/${userId}/kickOut`, null, () => {});
}

function banUser(shareId, userId) {
  request.put(`/api/shares/${shareId}/contents/users/${userId}/ban`, null, () => {});
}

function allowUser(shareId, userId) {
  request.put(`/api/shares/${shareId}/contents/users/${userId}/allow`, null, () => {});
}

function sendReadyChat(shareId, message) {
  request.post(`/api/shares/${shareId}/contents/chats/ready`, { message }, () => {}, null, true);
}

function joinShare(socketClient, shareId) {
  if (socketClient && socketClient.state && socketClient.state.connected) {
    socketClient.sendMessage(`/pub/api/shares/${shareId}/contents/join`);
  }
}

function registerScreenType(socketClient, shareId, screenType) {
  if (socketClient && socketClient.state && socketClient.state.connected) {
    socketClient.sendMessage(`/pub/api/shares/${shareId}/contents/screenType`, screenType);
  }
}

function focusChange(socketClient, shareId, focus) {
  if (socketClient && socketClient.state && socketClient.state.connected) {
    socketClient.sendMessage(`/pub/api/shares/${shareId}/contents/focus`, focus);
  }
}

const messageClient = {
  closeShare,
  startShare,
  stopShare,
  kickOutUser,
  banUser,
  allowUser,
  sendReadyChat,
  joinShare,
  registerScreenType,
  focusChange,
};

export default messageClient;
