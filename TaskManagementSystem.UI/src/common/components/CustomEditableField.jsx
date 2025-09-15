import { useState } from "react";

export default function EditableField({
  taskId,
  field,
  value,
  onSave,
  renderDisplay,
  renderInput,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(taskId, { [field]: tempValue });
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => {
        if (!isEditing) {
          setIsEditing(true);
        }
      }}
    >
      {isEditing
        ? renderInput({
            value: tempValue,
            onChange: setTempValue,
            onBlur: handleSave,
            onEnter: handleSave,
          })
        : renderDisplay(value)}
    </div>
  );
}
