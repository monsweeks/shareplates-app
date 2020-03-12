import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button } from '@/components';
import './BottomButton.scss';

class BottomButton extends React.PureComponent {
  render() {
    const { className, t, onList, onEdit, onDelete, onSave, saveText, onCancel, buttonType } = this.props;

    return (
      <div className={`bottom-button-wrapper ${className} ${buttonType}`}>
        {buttonType === 'text' && (
          <div>
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
              <Button type="submit" className="ml-2" color="primary" onClick={onEdit}>
                {t('button.edit')}
              </Button>
            )}
            {onSave && (
              <Button type="submit" className="ml-2" color="primary" onClick={onSave}>
                {t(saveText)}
              </Button>
            )}
          </div>
        )}
        {buttonType === 'icon' && (
          <div>
            {onDelete && (
              <Button className="float-left" color="danger" onClick={onDelete}>
                <i className="fal fa-trash-alt" />
              </Button>
            )}
            {onCancel && (
              <Button className="ml-2" color="secondary" onClick={onCancel}>
                <i className="fal fa-arrow-alt-left" />
              </Button>
            )}
            {onList && (
              <Button className="ml-2" color="secondary" onClick={onList}>
                <i className="fal fa-list-alt" />
              </Button>
            )}
            {onEdit && (
              <Button type="submit" className="ml-2" color="primary" onClick={onEdit}>
                <i className="fal fa-pencil-alt" />
              </Button>
            )}
            {onSave && (
              <Button type="submit" className="ml-2" color="primary" onClick={onSave}>
                <i className="fal fa-save" />
              </Button>
            )}
          </div>
        )}
        {buttonType === 'iconText' && (
          <div>
            {onDelete && (
              <Button className="float-left" color="danger" onClick={onDelete}>
                <span>
                  <i className="fal fa-trash-alt" />
                </span>
                <span>{t('button.delete')}</span>
              </Button>
            )}
            {onCancel && (
              <Button className="ml-2" color="secondary" onClick={onCancel}>
                <span>
                  <i className="fal fa-arrow-alt-left" />
                </span>
                <span>{t('button.cancel')}</span>
              </Button>
            )}
            {onList && (
              <Button className="ml-2" color="secondary" onClick={onList}>
                <span>
                  <i className="fal fa-list-alt" />
                </span>
                <span>{t('button.list')}</span>
              </Button>
            )}
            {onEdit && (
              <Button type="submit" className="ml-2" color="primary" onClick={onEdit}>
                <span>
                  <i className="fal fa-pencil-alt" />
                </span>
                <span>{t('button.edit')}</span>
              </Button>
            )}
            {onSave && (
              <Button type="submit" className="ml-2" color="primary" onClick={onSave}>
                <span>
                  <i className="fal fa-save" />
                </span>
                <span>{t(saveText)}</span>
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(BottomButton);

BottomButton.defaultProps = {
  t: null,
  className: '',
  saveText: '저장',
  buttonType: 'text',
};

BottomButton.propTypes = {
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onList: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  saveText: PropTypes.string,
  t: PropTypes.func,
  className: PropTypes.string,
  buttonType: PropTypes.string,
};
