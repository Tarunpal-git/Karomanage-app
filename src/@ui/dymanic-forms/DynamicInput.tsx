import React, { FC, memo, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import TextFieldMui from "./fields/TextFieldMui";
import MobileFieldMui from "./fields/MobileFieldMui";
import EmailFieldMui from "./fields/EmailFieldMui";
import SelectFieldMui from "./fields/SelectFieldMui";
import RadioFiledMui from "./fields/RadioFiledMui";
import DateFieldMui from "./fields/DateFieldMui";

interface IDynamicInput extends TFormField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: UseFormReturn<any>;
}

const DynamicInput: FC<IDynamicInput> = ({
  handler,
  name,
  type,
  message,
  options,
}) => {
  const renderInput = useMemo(() => {
    switch (type) {
      case "textField":
        return <TextFieldMui handler={handler} name={name} label={message} />;
      case "mobileNumber":
        return <MobileFieldMui handler={handler} name={name} label={message} />;
      case "email":
        return <EmailFieldMui handler={handler} name={name} label={message} />;
      case "number":
        return <MobileFieldMui handler={handler} name={name} label={message} />;

      case "dropDown":
        return (
          <SelectFieldMui
            handler={handler}
            label={message}
            name={name}
            options={options}
          />
        );
      case "radio":
        return (
          <RadioFiledMui
            containerStyles={{ marginTop: 10 }}
            handler={handler}
            label={message}
            options={options}
            name={name}
          />
        );
      case "date":
        return <DateFieldMui label={message} handler={handler} name={name} />;
      default:
        return null;
    }
  }, []);

  return renderInput;
};

export default memo(DynamicInput);
