import PropTypes from 'prop-types';

const UserPropTypes = PropTypes.shape({
  id: PropTypes.number,
  email: PropTypes.string,
  name: PropTypes.string,
  info: PropTypes.shape({
    icon: PropTypes.shape({
      type: PropTypes.string,
      data: PropTypes.objectOf(PropTypes.any),
    }),
  }),
  roleCode: PropTypes.string,
  activeRoleCode: PropTypes.string,
  isAdmin: PropTypes.bool,
  creationDate: PropTypes.string,
});

const TopicPropTypes = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  grpName: PropTypes.string,
  summary: PropTypes.string,
  privateYn: PropTypes.bool,
  content: PropTypes.objectOf(PropTypes.any),
});

const ContextPropTypes = PropTypes.shape({
  projectId: PropTypes.number,
});

const SharePropTypes = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  memo: PropTypes.string,
  privateYn: PropTypes.bool,
  openYn: PropTypes.bool,
  startedYn: PropTypes.bool,
  adminUserId: PropTypes.number,
  adminUserEmail: PropTypes.string,
  adminUserInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.any)]),
  adminUserName: PropTypes.string,
  offLineUserCount: PropTypes.number,
  onLineUserCount: PropTypes.number,
  currentChapterTitle: PropTypes.string,
  currentPageTitle: PropTypes.string,
  shareTimeBuckets: PropTypes.arrayOf(
    PropTypes.shape({
      openDate: PropTypes.string,
      closeDate: PropTypes.string,
    }),
  ),
  shareUsers: PropTypes.arrayOf(PropTypes.shape(PropTypes.any)),
  topicName: PropTypes.string,
});

export { UserPropTypes, TopicPropTypes, ContextPropTypes, SharePropTypes };
