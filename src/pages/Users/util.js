import Kakao from '@/vendor/kakao.min';

function socialLogin(vendor, noImplementSite) {
  const redirectUri =
    window.location.port === '3000'
      ? `http://${window.location.hostname}:8080/api/oauth/${vendor}/token`
      : `http://www.mindplates.com/api/oauth/${vendor}/token`;

  switch (vendor) {
    case 'kakao':
      if (Kakao.isInitialized()) {
        Kakao.Auth.login({
          redirectUri,
          scope: 'account_email',
        });
      } else {
        noImplementSite();
      }

      break;

    case 'naver': {
      window.location.href =
        'https://nid.naver.com/oauth2.0/authorize?client_id=FYKlwGmkoKaH8XSh3q6F&redirect_uri=http://www.mindplates.com/api/oauth/naver/token&response_type=code';
      break;
    }

    case 'facebook': {
      window.location.href =
        'https://www.facebook.com/v3.2/dialog/oauth?client_id=212487773500466&redirect_uri=http://www.mindplates.com/api/oauth/facebook/token&state=test&scope=email';
      break;
    }

    case 'google': {
      window.location.href =
        'https://accounts.google.com/o/oauth2/v2/auth?scope=email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://www.mindplates.com/api/oauth/google/token&client_id=766766390358-u4v4i9huft470ol689enfi9mq3gppbs6.apps.googleusercontent.com';
      break;
    }

    default:
      noImplementSite();
      break;
  }
}

function convertInfo(info) {
  let next = info;
  if (info && typeof info === 'string') {
    next = JSON.parse(info);
    if (!(next.icon && next.icon.type)) {
      next = {
        icon: {
          type: 'avatar',
          data: next.info,
        },
      };
    }
  }

  return next;
}

function convertUser(user) {
  const next = user;
  if (user && user.info && typeof user.info === 'string') {
    next.info = JSON.parse(user.info);
    if (!(next.info.icon && next.info.icon.type)) {
      next.info = {
        icon: {
          type: 'avatar',
          data: next.info,
        },
      };
    }
  }

  return next;
}

function convertUsers(users) {
  const next = users.slice(0);

  for (let i = 0; i < next.length; i += 1) {
    next[i] = convertUser(next[i]);
  }
  return next;
}

function serializeUser(user) {
  const next = user;
  if (user && user.info && typeof user.info === 'object') {
    next.info = JSON.stringify(user.info);
  }

  return next;
}

function serializeUsers(users) {
  const next = users.slice(0);

  for (let i = 0; i < next.length; i += 1) {
    next[i] = serializeUser(next[i]);
  }
  return next;
}

export { convertInfo, convertUser, convertUsers, socialLogin, serializeUsers };
