import Kakao from '@/vendor/kakao.min';

function socialLogin(vendor, noImplementSite) {
  const redirectUri =
    window.location.port === '3000'
      ? `http://${window.location.hostname}:8080/oauth/${vendor}/token`
      : `http://mindplates.com/oauth/${vendor}/token`;

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
        'https://nid.naver.com/oauth2.0/authorize?client_id=FYKlwGmkoKaH8XSh3q6F&redirect_uri=http://localhost:8080/oauth/naver/token&response_type=code';
      break;
    }

    case 'facebook': {
      window.location.href =
        'https://www.facebook.com/v3.2/dialog/oauth?client_id=212487773500466&redirect_uri=http://localhost:8080/oauth/facebook/token&state=test&scope=email';
      break;
    }

    case 'google': {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${redirectUri}&client_id=766766390358-u4v4i9huft470ol689enfi9mq3gppbs6.apps.googleusercontent.com`;
      break;
    }

    default:
      noImplementSite();
      break;
  }
}

export default socialLogin;
