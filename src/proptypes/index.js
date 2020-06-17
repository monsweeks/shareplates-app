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
});

const ContextPropTypes = PropTypes.shape({
  projectId: PropTypes.number,
});

export { UserPropTypes, ContextPropTypes };
