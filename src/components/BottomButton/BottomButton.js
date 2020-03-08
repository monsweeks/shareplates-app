import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button } from '@/components';
import './BottomButton.scss';

class BottomButton extends React.PureComponent {
  render() {
    const { className, t, onList, onEdit, onDelete, onSave, saveText, onCancel } = this.props;

    return (
      <div className={`bottom-button-wrapper ${className}`}>
        {onDelete && (
          <Button className="float-left" color="danger" onClick={onDelete}>
            {t('button.delete')}
          </Button>
        )}
        {onCancel && (
          <Button className="ml-2" color="secondary" onClick={onCancel}>
            {t('button.cancel')}
          </Button>
        )}
        {onList && (
          <Button className="ml-2" color="secondary" onClick={onList}>
            {t('button.list')}
          </Button>
        )}
        {onEdit && (
          <Button type='submit' className="ml-2" color="primary" onClick={onEdit}>
            {t('button.edit')}
          </Button>
        )}
        {onSave && (
          <Button type='submit' className="ml-2" color="primary" onClick={onSave}>
            {t(saveText)}
          </Button>
        )}

      </div>
    );
  }
}

export default withTranslation()(BottomButton);

BottomButton.defaultProps = {
  t: null,
  className: '',
  saveText : '저장',
};

BottomButton.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onList: PropTypes.func,
  onSave : PropTypes.func,
  onCancel : PropTypes.func,
  saveText : PropTypes.string,
  t: PropTypes.func,
  className: PropTypes.string,
};
