# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 12. The report
Under the title: Read the file back into a table on the form, with two filters.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

### Screen ch12#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters. This screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is chapter 11 done, with at least two pupils saved in YOUR file?
    How: Find YOUR file in the Debug folder. Open it. Count the lines.
    If not: Go to chapter 11.  [button: Go there ›]
  [tick box] Is there a View report button under the panels, named btnViewReport?
    How: Open frmDataEntry in the Design tab. Click the button and look at its Name.
    If not: Go to chapter 2, stage 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. The report form: its table and lists

### Screen ch12#2-1. Add the report form
The report is a form of its own. It shows every saved pupil in a table.
STEP 1. Click the Project menu along the top. Click the line that starts Add Form.
  You should see: A box opens with Form picked in its list.
  If it goes wrong I cannot see that line. -> Click your project's name in Solution Explorer first. Then open the Project menu again.
STEP 2. In the Name box at the bottom, type frmReport.cs. Click Add.
  You should see: frmReport opens in the Design tab. It is empty.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Add a new form]
    picture 1: Open the Project menu. Click the line that starts Add Form.
    picture 2: Form is picked. Type the form's name in the Name box.
    picture 3: Click Add. The new form opens in the Design tab.
[Big button at the foot: I've done this ✓]

### Screen ch12#2-2. Add the table and the two lists
Drag each control onto frmReport. Then give it its name and its Text. Make the table fill most of the form.
[Table of controls for frmReport. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  DataGridView | dgvReport (the grid that shows the table) | Nothing else to set
  Label | lblGroup (the label beside the group list) | Text = Group
  ComboBox | cbxGroup (the drop-down list that filters by group) | Items = All, Weak, Intermediate, Advanced
  Label | lblYear (the label beside the year list) | Text = Year
  ComboBox | cbxYear (the drop-down list that filters by year group) | Items = All, 11, 12, 13, 14
  Label | lblReportInstructions (the line of instructions at the top of the report) | Text = a line that says how to use the report
  You should see: The table is big. The two lists and their labels sit above it or beside it.
Yours will be different MY group names come from MY task. Type YOUR group names in cbxGroup, with All first. Put each choice on its own line.
Watch out Leave no space at the end of a choice. Advanced with a space after it will not match.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: The table and the lists]
    picture 1: Drag a DataGridView onto the form. Make it big.
    picture 2: Add the two lists and their labels.
[Big button at the foot: I've done this ✓]

### Screen ch12#2-3. Add the Close button
One more control. The Close button takes the pupil back to the data entry form.
[Table of controls for frmReport. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Button | btnClose (the close button on the report) | Text = Close
  You should see: frmReport now has a table, two lists, three labels and a Close button.
[Big button at the foot: I've done this ✓]

## Stage 3. Two lines at the top of the report code

### Screen ch12#3-1. Let the report use files
Open frmReport's code. Scroll to the very top. The top lines start with the word using. Click at the end of the last one and press Enter.
[CODE CARD. Type this. One line at the top]
  Where: under the other using lines, at the very top of frmReport's code
  using System.IO;
  [Line 1] The file tools: The same line as in chapter 11. This form reads the file, so it needs it too.
  [Names in this code: System.IO]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Without this line, File goes red in the code on the next screens.
[Big button at the foot: I've done this ✓]

### Screen ch12#3-2. Make a table in memory
A DataTable is a table kept in memory. The report fills it, then shows it.
[CODE CARD. Type this. A table in memory]
  Where: near the top, above the line public frmReport()
  private DataTable dt = new DataTable();
  [Line 1] A new empty table: A table called dt. It has no columns and no rows yet.
  [Names in this code: dt, DataTable]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Six new words in this chapter. Click a marked word to see what it means.
  DataTable = A table kept in memory, with columns and rows.
  string[] = A list of words, one after another.
  for loop = Code that runs again and again, once for each thing in a list.
  Split('~') = Cuts one line into pieces at each ~.
  DataGridView = The table you can see on the form.
  RowFilter = Hides the rows that do not match. Empty words show every row.
[Fold-out box, closed until clicked: See where it goes]
  [Picture strip: The top of frmReport's code]
    picture 1: The line goes near the top, above public frmReport().
[Big button at the foot: I've done this ✓]

## Stage 4. The Load event in four parts

### Screen ch12#4-1. Give the table seven columns
In the Design tab, double-click the title bar of frmReport. frmReport_Load appears in the code tab.
[CODE CARD. Type this. The Load event of frmReport, part 1 of 4]
  Where: between the curly brackets of frmReport_Load
  [grey, already there] private void frmReport_Load(object sender, EventArgs e)
  [grey, already there] {
      dt.Columns.Add("Forename", typeof(string));
      dt.Columns.Add("Surname", typeof(string));
      dt.Columns.Add("Year", typeof(string));
      dt.Columns.Add("Gender", typeof(string));
      dt.Columns.Add("Quiz Score", typeof(string));
      dt.Columns.Add("Reaction Score", typeof(string));
      dt.Columns.Add("Group", typeof(string));
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 6] The first four columns: Forename, Surname, Year and Gender. typeof string means each column holds words.
  [Lines 7 to 9] The last three columns: Quiz Score, Reaction Score and Group.
  MY report shows seven columns. Name the columns for what YOUR report must show.
  [Names in this code: dt]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch12#4-2. Read every line of the file
File.Exists checks the file is there. Each string[] is a list of words. The for loop runs once for each line. Split('~') cuts it.
[CODE CARD. Type this. The Load event of frmReport, part 2 of 4]
  Where: under part 1, inside frmReport_Load
  
      if (File.Exists("pupilStats.txt"))
      {
          string[] lines = File.ReadAllLines("pupilStats.txt");
          for (int i = 0; i < lines.Length; i++)
          {
              string[] parts = lines[i].Split('~');
  [Lines 10 to 12] Is the file there?: An empty line. Then the rest only runs if the file is there.
  [Line 13] Read every line: lines holds every line of the file.
  [Lines 14 to 16] Cut each line: For each line, parts holds its pieces, cut at each ~.
  MY file is pupilStats.txt. Type the same name YOU used in chapter 11, in both places.
  [Names in this code: lines, parts, i, File.Exists, File.ReadAllLines]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Animated picture: One saved line cut at every ~ into eleven pieces, numbered parts[0] to parts[10].]  Caption: Count from 0. parts[0] is the first piece.
[Big button at the foot: I've done this ✓]

### Screen ch12#4-3. Put the pieces in a row
Each row takes the pieces in the same order as the columns. The note on each line says which column.
[CODE CARD. Type this. The Load event of frmReport, part 3 of 4]
  Where: under part 2, inside frmReport_Load
              dt.Rows.Add(
                  parts[0], //Forename
                  parts[1], //Surname
                  parts[3], //year
                  parts[4], //Gender
                  parts[2], //Quiz Score
                  parts[9], //Reaction Test Score
                  parts[10] //Assigned group
               );
          }
      }
  [Line 17] A new row: dt.Rows.Add starts a new row of the table.
  [Lines 18 to 24] Seven pieces: Each line picks one piece by its number. The note says its column.
  [Lines 25 to 27] Close it all: The round bracket ends the row. Then the loop and the if end.
  [Names in this code: dt, parts]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Look at the numbers, not the order. The year is parts[3], but it is the third column.
[Big button at the foot: I've done this ✓]

### Screen ch12#4-4. No file? Say so. Then show the table
The DataGridView is the table you can see. It shows dt.
[CODE CARD. Type this. The Load event of frmReport, part 4 of 4]
  Where: under part 3, inside frmReport_Load
      else
      {
          MessageBox.Show("File not found");
      }
  
      //Connect the DataTable to the DataGridView
      dgvReport.DataSource = dt;
      dgvReport.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.AllCells;
      dgvReport.RowHeadersVisible = false;
      dgvReport.ReadOnly = true;
  [grey, already there] }
  [Lines 28 to 31] No file: else runs when the file is not there. A message says so.
  [Lines 32 to 34] Show the table: An empty line and a note. Then the grid shows dt.
  [Lines 35 to 37] Make it tidy: Columns fit their words, the grey edge goes and nobody can type in it.
  [Line 38] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: dgvReport, dt]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of dgvReport and picking it from the list]
[Big button at the foot: I've done this ✓]

## Stage 5. The two lists and the two buttons

### Screen ch12#5-1. Show only the group that is chosen
In the Design tab, double-click cbxGroup. cbxGroup_SelectedIndexChanged appears in the code tab.
[CODE CARD. Type this. The group list]
  Where: between the curly brackets of cbxGroup_SelectedIndexChanged
  [grey, already there] private void cbxGroup_SelectedIndexChanged(object sender, EventArgs e)
  [grey, already there] {
      //Resest filter to show everything
      dt.DefaultView.RowFilter = "";
  
      //If group isn't "All", apply that filter only
      if(cbxGroup.Text != "All")
      {
          dt.DefaultView.RowFilter = "[Group] = '" + cbxGroup.Text + "'";
      }
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Show everyone first: A note. Then an empty RowFilter shows every row. Then an empty line.
  [Lines 6 to 10] Then show one group: If the choice is not All, only rows with that group stay.
  [Line 11] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: dt, cbxGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxGroup and picking it from the list]
[Fold-out box, closed until clicked: See the three kinds of mark]
  [Animated picture: The filter line with its double quotes, single quotes and square brackets each in a different colour.]  Caption: Type every mark. One missing mark stops the filter.
[Big button at the foot: I've done this ✓]

### Screen ch12#5-2. Show only the year that is chosen
In the Design tab, double-click cbxYear. The code has the same shape, with Year in place of Group.
[CODE CARD. Type this. The year list]
  Where: between the curly brackets of cbxYear_SelectedIndexChanged
  [grey, already there] private void cbxYear_SelectedIndexChanged(object sender, EventArgs e)
  [grey, already there] {
      //Resest filter to show everything
      dt.DefaultView.RowFilter = "";
  
      //If group isn't "All", apply that filter only
      if (cbxYear.Text != "All")
      {
          dt.DefaultView.RowFilter = "[Year] = '" + cbxYear.Text + "'";
      }
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Show everyone first: A note. Then an empty RowFilter shows every row. Then an empty line.
  [Lines 6 to 10] Then show one year: If the choice is not All, only rows with that year stay.
  [Line 11] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: dt, cbxYear]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxYear and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch12#5-3. The Close button
In the Design tab, double-click the Close button on frmReport.
[CODE CARD. Type this. The Close button]
  Where: between the curly brackets of btnClose_Click
  [grey, already there] private void btnClose_Click(object sender, EventArgs e)
  [grey, already there] {
      this.Close();
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Line 3] Close the report: This form closes. The data entry form is still open.
  [Line 4] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
[Big button at the foot: I've done this ✓]

### Screen ch12#5-4. Open the report from the data entry form
Open frmDataEntry in the Design tab. Double-click the View report button.
[CODE CARD. Type this. The View report button]
  Where: between the curly brackets of btnViewReport_Click
  [grey, already there] private void btnViewReport_Click(object sender, EventArgs e)
  [grey, already there] {
      new frmReport().Show();
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Line 3] Open the report: A new report form opens on top.
  [Line 4] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: frmReport]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of frmReport and picking it from the list]
Watch out No this.Close() here. The data entry form stays open under the report.
[Big button at the foot: I've done this ✓]

## Stage 6. Try it

### Screen ch12#6-1. Try your report
Run your program. Log in. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click View report.
    How: Every saved pupil is in the table.
    If not: Look at screens 4-1 to 4-4.  [button: Go there ›]
  [tick box] Must happen. Choose a group in the group list.
    How: Only the pupils in that group stay.
    If not: Look at screen 5-1.  [button: Go there ›]
  [tick box] Must happen. Choose All in the group list.
    How: Everyone is back.
    If not: Look at screen 5-1.  [button: Go there ›]
  [tick box] Must happen. Choose a year in the year list.
    How: Only the pupils in that year stay.
    If not: Look at screen 5-2.  [button: Go there ›]
  [tick box] Must happen. Click Close.
    How: The report shuts. The data entry form is still there.
    If not: Look at screens 5-3 and 5-4.  [button: Go there ›]
  [tick box] Must NOT happen. Open the report again. Choose a group nobody is in.
    How: The table shows NO rows, and no error appears.
    If not: If an error appears, look at screen 5-1.  [button: Go there ›]
[Fold-out box, closed until clicked: See the report]
  [Picture strip: The report, one group chosen]
    picture 1: One group is chosen. Only its pupils show.
[Big button at the foot: Chapter 12 is done ✓]
