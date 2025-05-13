const CheckPermission = (
  permission: any,
  role_id: number,
  permission_id: number
) => {
  const existing = permission.find((item: any) => {
    return item.role_id === role_id;
  });
  if (existing?.listAction) {
    const action = existing.listAction.find(
      (item: any) => item.permission_id === permission_id
    );
    if (action) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default CheckPermission;
