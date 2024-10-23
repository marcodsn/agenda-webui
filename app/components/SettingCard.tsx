import React, { useState } from 'react';
import styles from './SettingCard.module.css';
import { IconCornerDownRight, IconEdit, IconTrash } from '@tabler/icons-react';
import EditSettingDialog from '@/app/components/dialogs/settings/EditSettingDialog';
import DeleteSettingDialog from '@/app/components/dialogs/settings/DeleteSettingDialog';
import { Setting } from '@/app/api/settingsApi';

interface SettingCardProps {
  setting: Setting;
  onSettingUpdated: (setting: Setting) => void;
  onSettingDeleted: (key: string) => void;
}

const SettingCard: React.FC<SettingCardProps> = ({
  setting,
  onSettingUpdated,
  onSettingDeleted
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className={styles.settingCard}>
        <div className={styles.header}>
          <p className={styles.key}>{setting.key}</p>
          <div className={styles.actions}>
            <IconEdit
              className={styles.actionIcon}
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
            />
            <IconTrash
              className={styles.actionIcon}
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
        </div>
        <div className="flex">
          <p>
            <IconCornerDownRight className='size-4' />
          </p>
          <p className={styles.value}>{setting.value}</p>
        </div>
      </div>

      <EditSettingDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        setting={setting}
        onSettingUpdated={onSettingUpdated}
      />

      <DeleteSettingDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        setting={setting}
        onSettingDeleted={onSettingDeleted}
      />
    </>
  );
};

export default SettingCard;