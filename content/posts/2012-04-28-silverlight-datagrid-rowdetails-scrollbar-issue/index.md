---
title: Silverlight datagrid RowDetails Scrollbar Issue
id: '2156'
date: 2012-04-28 14:08:50
tags:
- Programming
---

While developing a customer application in Silverlight 4, we find a bug in the standard datagrid control of the framework.

If you have a custom datagrid _RowDetailsTemplate_ and this is opened and closed by a button click, you can see that, when opening the last visible row in your datagrid, the RowDetails  remains hidden, or partially hidden because the grid does not scroll automatically down to fully reveal it.

The only work-around I’ve found to avoid this misbehavior is to add the _RowDetailsVisibilityChanged_ event to the grid and do the following:

```csharp
double _rowheight = 0;
private void MyGrid_RowDetailsVisibilityChanged(object sender, DataGridRowDetailsEventArgs e)
{
if (e.Row.DetailsVisibility == System.Windows.Visibility.Visible)
{
_rowheight = e.Row.ActualHeight;
e.Row.Height = e.DetailsElement.DesiredSize.Height + _rowheight;
MyGrid.Dispatcher.BeginInvoke(delegate
{
MyGrid.Focus();
MyGrid.UpdateLayout();
MyGrid.SelectedItem = e.Row.DataContext;
MyGrid.CurrentColumn = SettingGrid.Columns[0];
MyGrid.ScrollIntoView(MyGrid.SelectedItem, MyGrid.Columns[0]);
});
}
else
{
e.Row.Height = _rowheight;
MyGrid.Dispatcher.BeginInvoke(delegate
{
MyGrid.Focus();
MyGrid.UpdateLayout();
});
}
}
```

As you can see the trick is to expand the grid row so that its height is equals to the height of the row details. Doing so you can than call the method _ScrollIntoView_ to reveal the whole row details. When the row details is closed, you have to restore the original row height.

A simple trick to fix one of the countless bugs in silverlight framework :-? !