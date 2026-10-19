# Chapter 12, the report (DESIGN_SPEC §9 ch12, voice §7a). Run by tools/build_content.py with its helpers.
D = 'frmDataEntry'
R = 'frmReport'
L = 'frmReport_Load'
IN = 'inside frmReport_Load'
CH = {
 "id": "12", "n": 12, "of": 15, "title": "The report", "kind": "new", "color": "#B5651D",
 "one": "Read the file back into a table on the form, with two filters.",
 "prev": {"id": "11", "n": 11, "title": "Save the details to the file"},
 "next": {"id": "13", "n": 13, "title": "Help buttons on every form"},
 "methods": [[D, "btnViewReport_Click"], [R, L], [R, "cbxGroup_SelectedIndexChanged"], [R, "cbxYear_SelectedIndexChanged"], [R, "btnClose_Click"]],
 "stages": [
  {"id": "1", "title": "Check what you need first", "screens": [
   {"id": "1", "title": "Check the parts this chapter needs", "foot": "have",
    "goal": "Before I start, I check that two pupils are saved and that the View report button is there.",
    "blocks": [
    {"p": "This chapter uses work from earlier chapters. This screen checks that it is there."},
    {"check": [
     have("1-1.t1", "Is chapter 11 done, with at least two pupils saved in YOUR file?",
          "Right-click the project in Solution Explorer. Click Open Folder in File Explorer. Open bin, then Debug. Open YOUR file and count the lines.", "Go to chapter 11, stage 5.", "#cw/11/5-1"),
     have("1-1.t2", "Is there a View report button under the panels, named btnViewReport?",
          "Open frmDataEntry in the Design tab. Click the button and look at its Name.", "Go to chapter 2, stage 3.", "#cw/02/3-1")]}
   ]}]},
  {"id": "2", "title": "The report form: its table and lists", "screens": [
   {"id": "1", "title": "Add the report form", "foot": "done",
    "goal": "I add a new form called frmReport.",
    "blocks": [
    {"p": "The report is a form of its own. It shows every saved pupil in a table."},
    {"steps": [
     step("2-1.1", "Click the Project menu along the top. Click the line that starts Add Form.",
          "A box opens with Form picked in its list.",
          None, [["I cannot see that line.", "Click your project's name in Solution Explorer first. Then open the Project menu again."]]),
     step("2-1.2", "In the Name box at the bottom, type frmReport.cs. Click Add.",
          "frmReport opens in the Design tab. It is empty.")]},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F5", "Add a new form", [
        ("f5-1", "The Project menu open, with Add Form in its list", "Open the Project menu. Click the line that starts Add Form."),
        ("f5-2", "The Add New Item box with Form picked and a name in the Name box", "Form is picked. Type the form's name in the Name box."),
        ("f5-3", "The new empty form in the Design tab", "Click Add. The new form opens in the Design tab. My picture says frmTemp. Yours shows the name you typed.")])]}}
   ]},
   {"id": "2", "title": "Add the table and the two lists", "foot": "done",
    "goal": "frmReport holds a big table, a group list, a year list and three labels.",
    "blocks": [
    {"p": "Drag each control onto frmReport and name it. Drag the corner of the table so it fills most of the form."},
    {"controls": {"form": R, "rows": [
      {"toolbox": "DataGridView", "name": "dgvReport", "set": []},
      {"toolbox": "Label", "name": "lblGroup", "set": ["Text = Group"]},
      {"toolbox": "ComboBox", "name": "cbxGroup", "set": ["Items = All, Weak, Intermediate, Advanced"]},
      {"toolbox": "Label", "name": "lblYear", "set": ["Text = Year"]},
      {"toolbox": "ComboBox", "name": "cbxYear", "set": ["Items = All, 11, 12, 13, 14"]},
      {"toolbox": "Label", "name": "lblReportInstructions", "set": ["Text = a line that says how to use the report"]}],
     "done": "The table is big. The two lists and their labels sit above it or beside it."}},
    {"yours": "MY groups are Weak, Intermediate and Advanced. In Properties, click the three dots beside Items. Type All, then YOUR groups, one on each line."},
    {"watch": "Leave no space at the end of a choice. Advanced with a space after it will not match."},
    {"box": {"title": "See it in Visual Studio", "fold": True, "blocks": [
      frames("F13", "The table and the lists", [
        ("f13-1", "The Toolbox searched for DataGridView, next to frmReport in the Design tab", "Drag a DataGridView onto the form. Make it big."),
        ("f13-2", "frmReport with the table, two drop-down lists and their labels", "Add the two lists and their labels.")])]}}
   ]},
   {"id": "3", "title": "Add the Close button", "foot": "done",
    "goal": "frmReport has a Close button called btnClose.",
    "blocks": [
    {"p": "One more control. The Close button takes the pupil back to the data entry form."},
    {"controls": {"form": R, "rows": [
      {"toolbox": "Button", "name": "btnClose", "set": ["Text = Close"]}],
     "done": "frmReport now has a table, two lists, three labels and a Close button."}}
   ]}]},
  {"id": "3", "title": "Two lines at the top of the report code", "screens": [
   {"id": "1", "title": "Let the report use files", "foot": "done",
    "goal": "One line at the top of frmReport's code lets the report use the file tools.",
    "blocks": [
    {"p": "Open frmReport's code. Scroll to the very top. The top lines start with the word using. Click at the end of the last one and press Enter."},
    {"code": {"id": "3-1.c1", "kind": "type", "snippet": True, "title": "One line at the top", "lang": "cs",
              "where": "under the other using lines, at the very top of frmReport's code",
              "text": "using System.IO;",
              "partLines": [[1, 1, "The file tools", "The same line as in chapter 11. This form reads the file, so it needs it too."]],
              "names": ["System.IO"], "isense": []}},
    {"watch": "Without this line, File goes red in the code on the next screens."}
   ]},
   {"id": "2", "title": "Make a table in memory", "foot": "done",
    "goal": "One line near the top makes a table called dt that the whole report can use.",
    "blocks": [
    {"p": "A [[DataTable|0]] is a table kept in memory. The report fills it, then shows it."},
    {"code": {"id": "3-2.c1", "kind": "type", "snippet": True, "title": "A table in memory", "lang": "cs",
              "where": "near the top, above the line public frmReport()",
              "text": "private DataTable dt = new DataTable();",
              "partLines": [[1, 1, "A new empty table", "A table called dt. It has no columns and no rows yet."]],
              "names": ["dt", "DataTable"], "isense": []}},
    {"words": [
      ["DataTable", "A table kept in memory, with columns and rows.", "3-2", True],
      ["string[]", "A list of words, one after another.", "4-2", True],
      ["for loop", "Code that runs again and again, once for each thing in a list.", "4-2", False],
      ["Split('~')", "Cuts one line into pieces at each ~.", "4-2", True],
      ["DataGridView", "The table you can see on the form.", "4-4", True],
      ["RowFilter", "Hides the rows that do not match. Empty words show every row.", "5-1", True]],
     "intro": "Six new words in this chapter. Click a marked word to see what it means."},
    {"box": {"title": "See where it goes", "fold": True, "blocks": [
      frames("F20", "The top of frmReport's code", [
        ("f20-2", "The top of frmReport.cs with the DataTable line typed above the public frmReport() line", "The line goes near the top, above public frmReport().")])]}}
   ]}]},
  {"id": "4", "title": "The Load event in four parts", "screens": [
   {"id": "1", "title": "Give the table seven columns", "foot": "done",
    "goal": "When the report opens, the table gets seven columns, one for each thing it shows.",
    "blocks": [
    {"p": "In the Design tab, double-click the title bar of frmReport. frmReport_Load appears in the code tab."},
    code("4-1.c1", "The Load event of frmReport, part 1 of 4", "between the curly brackets of " + L, R, L, 1, 9,
         [given(1, 2),
          [3, 6, "The first four columns", "Surname, Forename, Year and Gender. typeof string means each column holds words."],
          [7, 9, "The last three columns", "Quiz Score, Reaction Score and Group."]],
         ["dt"], [],
         yours="MY report shows seven columns. Name the columns for what YOUR report must show.")
   ]},
   {"id": "2", "title": "Read every line of the file", "foot": "done",
    "goal": "If the file is there, every line is read, and each line is cut into pieces at each ~.",
    "blocks": [
    {"p": "File.Exists checks the file is there. Each [[string[]|1]] is a list of words. The [[for loop|2]] runs once for each line. [[Split('~')|3]] cuts it."},
    code("4-2.c1", "The Load event of frmReport, part 2 of 4", "under part 1, " + IN, R, L, 10, 16,
         [[10, 12, "Is the file there?", "An empty line. Then the rest only runs if the file is there."],
          [13, 13, "Read every line", "lines holds every line of the file."],
          [14, 16, "Cut each line", "For each line, parts holds its pieces, cut at each ~."]],
         ["lines", "parts", "i", "File.Exists", "File.ReadAllLines"], [],
         yours="MY file is pupilStats.txt. Type the same name YOU used in chapter 11, in both places."),
    {"drawn": {"id": "record-line", "label": "parts", "pieces": ["Smith", "Anna", "4", "12", "F", "6.33", "5", "6", "8", "5", "Advanced"],
               "alt": "One saved line cut at every ~ into eleven pieces, numbered parts[0] to parts[10].",
               "say": "Count from 0. parts[0] is the first piece."}}
   ]},
   {"id": "3", "title": "Put the pieces in a row", "foot": "done",
    "goal": "Seven of the eleven pieces go into a new row of the table, in the order of the columns.",
    "blocks": [
    {"p": "Each row takes the pieces in the same order as the columns. The note on each line says which column."},
    code("4-3.c1", "The Load event of frmReport, part 3 of 4", "under part 2, " + IN, R, L, 17, 27,
         [[17, 17, "A new row", "dt.Rows.Add starts a new row of the table."],
          [18, 24, "Seven pieces", "Each line picks one piece by its number. The note says its column."],
          [25, 27, "Close it all", "The round bracket ends the row. Then the loop and the if end."]],
         ["dt", "parts"], []),
    {"watch": "Look at the numbers, not the order. The year is parts[3], but it is the third column."},
    {"yours": "Use YOUR save line from chapter 11. Count its pieces from 0 to find the number of each one."}
   ]},
   {"id": "4", "title": "No file? Say so. Then show the table", "foot": "done",
    "goal": "With no file a message shows, and then the table appears in the grid on the form.",
    "blocks": [
    {"p": "The [[DataGridView|4]] is the table you can see. It shows dt."},
    code("4-4.c1", "The Load event of frmReport, part 4 of 4", "under part 3, " + IN, R, L, 28, 38,
         [[28, 31, "No file", "else runs when the file is not there. A message says so."],
          [32, 34, "Show the table", "An empty line and a note. Then the grid shows dt."],
          [35, 37, "Make it tidy", "Columns fit their words, the grey edge goes and nobody can type in it."],
          given(38, 38)],
         ["dgvReport", "dt"], ["dgvReport"])
   ]}]},
  {"id": "5", "title": "The two lists and the two buttons", "screens": [
   {"id": "1", "title": "Show only the group that is chosen", "foot": "done",
    "goal": "Choosing a group shows only the pupils in that group, and All shows everyone.",
    "blocks": [
    {"p": "In the Design tab, double-click cbxGroup. cbxGroup_SelectedIndexChanged appears in the code tab. [[RowFilter|5]] picks which rows show."},
    code("5-1.c1", "The group list", "between the curly brackets of cbxGroup_SelectedIndexChanged", R, "cbxGroup_SelectedIndexChanged", 1, 11,
         [given(1, 2),
          [3, 5, "Show everyone first", "A note. Then an empty RowFilter shows every row. Then an empty line."],
          [6, 10, "Then show one group", "If the choice is not All, only rows with that group stay."],
          given(11, 11)],
         ["dt", "cbxGroup"], ["cbxGroup"]),
    {"box": {"title": "See the three kinds of mark", "fold": True, "blocks": [
      {"drawn": {"id": "three-quotes", "key": [['"', "goes round words"], ["'", "goes round the group, inside the words"], ["[Group]", "is the name of the column"]],
                 "alt": "The filter line with its double quotes, single quotes and square brackets each in a different colour.",
                 "say": "Type every mark. One missing mark stops the filter."}}]}}
   ]},
   {"id": "2", "title": "Show only the year that is chosen", "foot": "done",
    "goal": "Choosing a year shows only the pupils in that year, and All shows everyone.",
    "blocks": [
    {"p": "In the Design tab, double-click cbxYear. The code has the same shape, with Year in place of Group."},
    code("5-2.c1", "The year list", "between the curly brackets of cbxYear_SelectedIndexChanged", R, "cbxYear_SelectedIndexChanged", 1, 11,
         [given(1, 2),
          [3, 5, "Show everyone first", "A note. Then an empty RowFilter shows every row. Then an empty line."],
          [6, 10, "Then show one year", "If the choice is not All, only rows with that year stay."],
          given(11, 11)],
         ["dt", "cbxYear"], ["cbxYear"])
   ]},
   {"id": "3", "title": "Make the Close button shut the report", "foot": "done",
    "goal": "Close shuts the report and the data entry form is still there.",
    "blocks": [
    {"p": "In the Design tab, double-click the Close button on frmReport."},
    code("5-3.c1", "The Close button", "between the curly brackets of btnClose_Click", R, "btnClose_Click", 1, 4,
         [given(1, 2), [3, 3, "Close the report", "This form closes. The data entry form is still open."], given(4, 4)],
         [], [])
   ]},
   {"id": "4", "title": "Open the report from the data entry form", "foot": "done",
    "goal": "The View report button opens the report and leaves the data entry form open.",
    "blocks": [
    {"p": "Open frmDataEntry in the Design tab. Double-click the View report button."},
    code("5-4.c1", "The View report button", "between the curly brackets of btnViewReport_Click", D, "btnViewReport_Click", 1, 4,
         [given(1, 2), [3, 3, "Open the report", "A new report form opens on top."], given(4, 4)],
         ["frmReport"], ["frmReport"]),
    {"watch": "No this.Close() here. The data entry form stays open under the report."}
   ]}]},
  {"id": "6", "title": "Try it", "screens": [
   {"id": "1", "title": "Try your report", "foot": "chapter-done",
    "goal": "I open the report, try both lists and close it.",
    "blocks": [
    {"p": "Run your program. Log in. Then try each row."},
    {"check": [
     tryit("6-1.t1", "Click View report.", "Every saved pupil is in the table.", "Look at screens 4-1 to 4-4.", "#cw/12/4-1"),
     tryit("6-1.t2", "Choose a group in the group list.", "Only the pupils in that group stay.", "Look at screen 5-1.", "#cw/12/5-1"),
     tryit("6-1.t3", "Choose All in the group list.", "Everyone is back.", "Look at screen 5-1.", "#cw/12/5-1"),
     tryit("6-1.t4", "Choose a year in the year list.", "Only the pupils in that year stay.", "Look at screen 5-2.", "#cw/12/5-2"),
     tryit("6-1.t5", "Click Close.", "The report shuts. The data entry form is still there.", "Look at screens 5-3 and 5-4.", "#cw/12/5-3"),
     tryit("6-1.t6", "Open the report again. Choose a group nobody is in.", "The table shows NO rows, and no error appears.", "If an error appears, look at screen 5-1.", "#cw/12/5-1", neg=True)]},
    {"box": {"title": "See the report", "fold": True, "blocks": [
      frames("F18", "The report, one group chosen", [
        ("f18-1", "The running report with one group chosen in the group list", "One group is chosen. Only its pupils show.")])]}}
   ]}]}
 ]}
