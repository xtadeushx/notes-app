function mappingNotesStatus (notesList, selector){
 return notesList.reduce((acc, prev) => {
    if (prev.status === selector) {
      if (acc[prev.category]) {
        acc[prev.category].status.archived = (acc[prev.category].status.archived || 0) + 1;
      } else {
        acc[prev.category] = { status: { archived: 1, active: 0 } };
      }
    } else {
      if (acc[prev.category]) {
        acc[prev.category].status.active = (acc[prev.category].status.active || 0) + 1;
      } else {
        acc[prev.category] = { status: { archived: 0, active: 1 } };
      }
    }
    return acc;
  }, {});
}

export {mappingNotesStatus};