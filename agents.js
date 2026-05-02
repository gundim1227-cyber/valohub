.stories {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
}
#storiesRow {
  display: flex; gap: 14px;
  overflow-x: auto; padding-bottom: 4px;
}
#storiesRow::-webkit-scrollbar { height: 3px; }
#storiesRow::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.sitm {
  display: flex; flex-direction: column;
  align-items: center; gap: 6px;
  cursor: pointer; flex-shrink: 0;
}
.sring {
  width: 56px; height: 56px; border-radius: 50%;
  border: 2px solid var(--red); padding: 2px;
  position: relative; overflow: visible;
}
.sring img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.sname {
  font-size: .68rem; color: var(--muted);
  max-width: 64px; text-align: center;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
