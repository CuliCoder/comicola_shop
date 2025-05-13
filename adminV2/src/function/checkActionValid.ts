interface Action {
  entity: string;
  action: string;
}

const checkActionValid = (
  validAction: Action[],
  entity: string,
  action: string
): boolean => {
  const existing = validAction.find(
    (item) => item.entity === entity && item.action === action
  );
  if (existing == undefined) {
    return true;
  } else {
    return false;
  }
};

export default checkActionValid;
