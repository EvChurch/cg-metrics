export const updateGroupAttributeValue = (
  groupId: number,
  key: string,
  value: string
) => {
  window.parent.postMessage(
    {
      type: "ROCK_API_REQUEST",
      url: `/api/Groups/AttributeValue/${String(
        groupId
      )}?attributeKey=${key}&attributeValue=${value}`,
      method: "POST",
    },
    "*"
  );
};
