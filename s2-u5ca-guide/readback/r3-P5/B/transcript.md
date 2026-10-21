# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 12. The report
Under the title: Read the file back into a table on the form, with two filters.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 6. Check what you need first
Banner at the top of every screen in this part: "Part 1 of 6. You are checking the parts this chapter needs"

### Screen ch12#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters, so this screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is chapter 11 done, with at least two pupils saved in YOUR file?
    How: Right-click the project in Solution Explorer. Click Open Folder in File Explorer. Open bin, then Debug. Open YOUR file and count the lines.
    If not: Go to chapter 11, part 5.  [button: Go there ›]
  [tick box] Is there a View report button under the panels, named btnViewReport?
    How: Open frmDataEntry in the Design tab. Click the button and look at its Name.
    If not: Go to chapter 2, part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 6. The report form: its table and lists
Banner at the top of every screen in this part: "Part 2 of 6. You are making the report form"

### Screen ch12#2-0. Make the report form with its table and lists
[Opening screen of this part, one card]
The report is a form of its own. It holds a big table, two lists, three labels and a Close button.
When it works, frmReport sits in Solution Explorer with every control named.
[Big button at the foot: Next ›]

### Screen ch12#2-1. Add the report form
The report is a form of its own that shows every saved pupil in a table.
STEP 1. Click the Project menu along the top. Click the line that starts Add Form.
  You should see: A box opens with Form picked in its list.
  If it goes wrong I cannot see that line. -> Click your project's name in Solution Explorer first. Then open the Project menu again.
STEP 2. In the Name box at the bottom, type frmReport.cs. Click Add.
  You should see: frmReport opens in the Design tab. It is empty.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Add a new form]
    picture 1: Open the Project menu. Click the line that starts Add Form.
    picture 2: Form is picked. Type the form's name in the Name box.
    picture 3: Click Add. The new form opens in the Design tab. My picture says frmTemp. Yours shows the name you typed.
Line above the big button: Done when frmReport is open in the Design tab, empty
[Big button at the foot: I've done this ✓]

### Screen ch12#2-2. Add the table and the two lists
Drag each control onto frmReport and name it.
Drag the corner of the table so it fills most of the form.
[Table of controls for frmReport. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  DataGridView | dgvReport (the grid that shows the table) | Nothing else to set
  Label | lblGroup (the label beside the group list) | Text = Group
  ComboBox | cbxGroup (the drop-down list that filters by group) | Items = All, Weak, Intermediate, Advanced
  Label | lblYear (the label beside the year list) | Text = Year
  ComboBox | cbxYear (the drop-down list that filters by year group) | Items = All, 11, 12, 13, 14
  Label | lblReportInstructions (the line of instructions at the top of the report) | Text = a line that says how to use the report
  You should see: The table is big. The two lists and their labels sit above it or beside it.
Yours will be different MY groups are Weak, Intermediate and Advanced. In Properties, click the three dots beside Items. Type All, then YOUR groups, one on each line.
Watch out Leave no space at the end of a choice. Advanced with a space after it will not match.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: The table and the lists]
    picture 1: Drag a DataGridView onto the form. Make it big.
    picture 2: Add the two lists and their labels.
Line above the big button: Done when the table, the two lists and the three labels are on frmReport and named
[Big button at the foot: I've done this ✓]

### Screen ch12#2-3. Add the Close button
The Close button takes the pupil back to the data entry form.
[Table of controls for frmReport. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Button | btnClose (the close button on the report) | Text = Close
  You should see: frmReport now has a table, two lists, three labels and a Close button.
Line above the big button: Done when btnClose is on frmReport with the word Close on it
[Big button at the foot: I've done this ✓]

## Part 3 of 6. Two lines at the top of the report code
Banner at the top of every screen in this part: "Part 3 of 6. You are making two lines at the top"

### Screen ch12#3-0. Add two lines at the top of the report code
[Opening screen of this part, one card]
One line lets the report use files. One line makes an empty table called dt that the whole report fills.
When it works, both new lines sit at the top of frmReport's code.
[Big button at the foot: Next ›]

### Screen ch12#3-1. Meet the six new words
Six new words come up in this chapter.
Click a marked word to see what it means.
  DataTable = A table kept in memory, with columns and rows.
  string[] = A list of words, one after another.
  for loop = Code that runs again and again, once for each thing in a list.
  Split('~') = Cuts one line into pieces at each ~.
  DataGridView = The table you can see on the form.
  RowFilter = Hides the rows that do not match. Empty words show every row.
Line above the big button: Done when you have read the six words
[Big button at the foot: Next ›]

### Screen ch12#3-2. Add the file tools line at the top
Open frmReport's code and scroll to the very top.
The top lines start with the word using. Click at the end of the last one and press Enter, so a new line waits.
[CODE CARD. Type this. One line at the top]
  Where: under the other using lines, at the very top of frmReport's code
  using System.IO;
  [Line 1] The file tools: The same line as in chapter 11. This form reads the file, so it needs it too.
  [Names in this code: System.IO]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Without this line, File goes red in the code on the next screens.
Line above the big button: Done when using System.IO sits under the other using lines and is not red
[Big button at the foot: I've done this ✓]

### Screen ch12#3-3. Make a table in memory
A DataTable is a table kept in memory, which the report fills and then shows.
[CODE CARD. Type this. A table in memory]
  Where: near the top, above the line public frmReport()
  private DataTable dt = new DataTable();
  [Line 1] A new empty table: A table called dt. It has no columns and no rows yet.
  [Names in this code: dt, DataTable]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Fold-out box, closed until clicked: See where it goes]
  [Picture strip: The top of frmReport's code]
    picture 1: The line goes near the top, above public frmReport().
Line above the big button: Done when the dt line sits above public frmReport() and has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 4 of 6. The Load event in four parts
Banner at the top of every screen in this part: "Part 4 of 6. You are making the code as the report opens"

### Screen ch12#4-0. Type the code that runs as the report opens
[Opening screen of this part, one card]
frmReport_Load has four chunks. It makes the columns, reads the file, fills the rows and shows the table.
When it works, every saved pupil has a row in the table as the report opens.
[Big button at the foot: Next ›]

### Screen ch12#4-1. Give the table seven columns
In the Design tab, double-click the title bar of frmReport.
frmReport_Load appears in the code tab.
[CODE CARD. Type this. The Load event of frmReport: code 1 of 4]
  Where: between the curly brackets of frmReport_Load
  [grey, already there] private void frmReport_Load(object sender, EventArgs e)
  [grey, already there] {
      dt.Columns.Add("Surname", typeof(string));
      dt.Columns.Add("Forename", typeof(string));
      dt.Columns.Add("Year", typeof(string));
      dt.Columns.Add("Gender", typeof(string));
      dt.Columns.Add("Quiz Score", typeof(string));
      dt.Columns.Add("Reaction Score", typeof(string));
      dt.Columns.Add("Group", typeof(string));
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 6] The first four columns: Surname, Forename, Year and Gender. typeof string means each column holds words.
  [Lines 7 to 9] The last three columns: Quiz Score, Reaction Score and Group.
  MY report shows seven columns. Name the columns for what YOUR report must show.
  [Names in this code: dt]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 3 to 9 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch12#4-2. Read every line of the file
File.Exists checks the file is there, then the for loop runs once for each line.
Each string[] is a list of words, and Split('~') cuts a line into pieces.
[CODE CARD. Type this. The Load event of frmReport: code 2 of 4]
  Where: under code 1, inside frmReport_Load
  
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
Line above the big button: Done when lines 10 to 16 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch12#4-3. See one line cut into eleven pieces
This picture shows one saved line cut into its eleven pieces.
[Animated picture: One saved line cut at every ~ into eleven pieces, numbered parts[0] to parts[10].]  Caption: Count from 0. parts[0] is the first piece.
Line above the big button: Done when you have looked at the picture and read the line under it
[Big button at the foot: Next ›]

### Screen ch12#4-4. Put the pieces in a row
Each row takes the pieces in the same order as the columns.
The note on each line says which column.
[CODE CARD. Type this. The Load event of frmReport: code 3 of 4]
  Where: under code 2, inside frmReport_Load
              dt.Rows.Add(
                  parts[0], //Surname
                  parts[1], //Forename
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
Yours will be different Use YOUR save line from chapter 11. Count its pieces from 0 to find the number of each one.
Line above the big button: Done when lines 17 to 27 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch12#4-5. Show the table, or say there is no file
The DataGridView is the table you can see, and it shows dt.
[CODE CARD. Type this. The Load event of frmReport: code 4 of 4]
  Where: under code 3, inside frmReport_Load
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
Line above the big button: Done when lines 28 to 37 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 5 of 6. The two lists and the two buttons
Banner at the top of every screen in this part: "Part 5 of 6. You are making the two lists and the two buttons"

### Screen ch12#5-0. Make the two lists and the two buttons work
[Opening screen of this part, one card]
Each list hides the rows that do not match. Close shuts the report, and View report opens it from the data entry form.
When it works, a group or a year narrows the table, and Close takes you back.
[Big button at the foot: Next ›]

### Screen ch12#5-1. Show only the group that is chosen
In the Design tab, double-click cbxGroup.
cbxGroup_SelectedIndexChanged appears in the code tab, and RowFilter picks which rows show.
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
Line above the big button: Done when lines 3 to 10 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch12#5-2. Show only the year that is chosen
In the Design tab, double-click cbxYear.
The code has the same shape, with Year in place of Group.
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
Line above the big button: Done when lines 3 to 10 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch12#5-3. Make the Close button shut the report
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
Line above the big button: Done when line 3 is typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch12#5-4. Open the report from the data entry form
Open frmDataEntry in the Design tab and double-click the View report button.
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
Line above the big button: Done when line 3 is typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

## Part 6 of 6. Try it
Banner at the top of every screen in this part: "Part 6 of 6. You are testing your report"

### Screen ch12#6-1. Try your report
Run your program, log in and then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click View report.
    How: Every saved pupil is in the table.
    If not: Look at the code on screens 4-1 to 4-5.  [button: Go there ›]
  [tick box] Must happen. Choose a group in the group list.
    How: Only the pupils in that group stay.
    If not: Look at the code on screen 5-1.  [button: Go there ›]
  [tick box] Must happen. Choose All in the group list.
    How: Everyone is back.
    If not: Look at the code on screen 5-1.  [button: Go there ›]
  [tick box] Must happen. Choose a year in the year list.
    How: Only the pupils in that year stay.
    If not: Look at the code on screen 5-2.  [button: Go there ›]
  [tick box] Must happen. Click Close.
    How: The report shuts. The data entry form is still there.
    If not: Look at the code on screens 5-3 and 5-4.  [button: Go there ›]
  [tick box] Must NOT happen. Open the report again. Choose a group nobody is in.
    How: The table shows NO rows, and no error appears.
    If not: If an error appears, look at the code on screen 5-1.  [button: Go there ›]
[Fold-out box, closed until clicked: See the report]
  [Picture strip: The report, one group chosen]
    picture 1: One group is chosen. Only its pupils show.
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 12 is done ✓]

# Chapter 13. Help buttons on every form
Under the title: A question-mark button on each panel that says what to do.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 5. Check what you need first
Banner at the top of every screen in this part: "Part 1 of 5. You are checking the parts this chapter needs"

### Screen ch13#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters, so this screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Does every panel on frmDataEntry have a ? button, with a name that starts btnHelp?
    How: Open frmDataEntry in the Design tab. Click each ? button and look at its Name.
    If not: Go to chapter 2, part 3.  [button: Go there ›]
  [tick box] Does the login form have a ? button?
    How: Open frmLogin in the Design tab. Look for the ? button.
    If not: Go to chapter 1, part 2.  [button: Go there ›]
  [tick box] Does the quiz form have a ? button in its score panel?
    How: Open frmQuiz in the Design tab. Look inside the score panel.
    If not: Go to chapter 6, part 2.  [button: Go there ›]
  [tick box] Does the reaction test form have a ? button?
    How: Open frmTest in the Design tab. Look inside the score panel.
    If not: Go to chapter 9, part 3.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I have all these ✓]

## Part 2 of 5. One help button
Banner at the top of every screen in this part: "Part 2 of 5. You are making the first help button"

### Screen ch13#2-1. Make the pupil details ? button speak
In the Design tab, double-click the ? button in the pupil details panel.
Its click code opens in the code tab.
[CODE CARD. Type this. The pupil details help button]
  Where: between the curly brackets of btnHelpPupilDetails_Click
  [grey, already there] private void btnHelpPupilDetails_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please enter ALL required details");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpPupilDetails]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Say what to DO, not what went wrong. Please enter ALL required details tells the pupil the next step.
Yours will be different MY message is Please enter ALL required details. Write YOUR message for YOUR panel, in one line.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

## Part 3 of 5. The other help buttons on the data entry form
Banner at the top of every screen in this part: "Part 3 of 5. You are making the other four data entry help buttons"

### Screen ch13#3-0. Make the other four data entry ? buttons speak
[Opening screen of this part, one card]
Four more ? buttons sit on frmDataEntry, one in each panel. Each one gets the same five lines with its own words.
When it works, every panel's ? button shows a message that says what to do there.
[Big button at the foot: Next ›]

### Screen ch13#3-1. Make the attempts ? button speak
In the Design tab, double-click the ? button in the attempts panel.
[CODE CARD. Type this. The attempts help button]
  Where: between the curly brackets of btnHelpSwimLengths_Click
  [grey, already there] private void btnHelpSwimLengths_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please select 'calculate average' to work out the average number of swim lengths");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpSwimLengths]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different Write YOUR message for YOUR attempts panel, in one line. It says what to do there.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

### Screen ch13#3-2. Make the quiz panel ? button speak
In the Design tab, double-click the ? button in the quiz panel.
[CODE CARD. Type this. The quiz panel help button]
  Where: between the curly brackets of btnHelpQuizResult_Click
  [grey, already there] private void btnHelpQuizResult_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Select 'Take quiz' option to take quiz");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpQuizResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different Write YOUR message for YOUR quiz panel, in one line. It says what to do there.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

### Screen ch13#3-3. Make the test panel ? button speak
In the Design tab, double-click the ? button in the test panel.
[CODE CARD. Type this. The test panel help button]
  Where: between the curly brackets of btnHelpReactionTest_Click
  [grey, already there] private void btnHelpReactionTest_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Select 'Take test' option to take reaction test");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpReactionTest]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different Write YOUR message for YOUR test panel, in one line. It says what to do there.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

### Screen ch13#3-4. Make the group panel ? button speak
In the Design tab, double-click the ? button in the group panel.
[CODE CARD. Type this. The group panel help button]
  Where: between the curly brackets of btnHelpSwimmingGroup_Click
  [grey, already there] private void btnHelpSwimmingGroup_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please select 'calculate swimming group' option to see your swimming group");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different Write YOUR message for YOUR group panel, in one line. It says what to do there.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

## Part 4 of 5. The help buttons on the other three forms
Banner at the top of every screen in this part: "Part 4 of 5. You are making the login, quiz and test help buttons"

### Screen ch13#4-0. Make the ? buttons on the other three forms speak
[Opening screen of this part, one card]
The login, quiz and test forms each have a ? button too. Open each form in the Design tab first.
When it works, every form in your program has a ? button that speaks.
[Big button at the foot: Next ›]

### Screen ch13#4-1. Make the login ? button speak
Open frmLogin in the Design tab and double-click its ? button.
[CODE CARD. Type this. The login help button]
  Where: between the curly brackets of btnHelp1_Click
  [grey, already there] private void btnHelp1_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please enter your username and password");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelp1]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different Write YOUR login message in one line. It says what to type to get in.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

### Screen ch13#4-2. Make the quiz form ? button speak
Open frmQuiz in the Design tab and double-click the ? button in the score panel.
[CODE CARD. Type this. The quiz form help button]
  Where: between the curly brackets of btnHelpQuizScore_Click
  [grey, already there] private void btnHelpQuizScore_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by user
      MessageBox.Show("Please complete the quiz question by question");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpQuizScore]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different Write YOUR quiz message in one line. It says what to do on the quiz.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

### Screen ch13#4-3. Make the test form ? button speak
Open frmTest in the Design tab and double-click its ? button.
[CODE CARD. Type this. The test form help button]
  Where: between the curly brackets of btnHelpReactionTest_Click
  [grey, already there] private void btnHelpReactionTest_Click(object sender, EventArgs e)
  [grey, already there] {
      //displays help message if required by the user
      MessageBox.Show("Read instructions and complete the reaction test");
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] A note, then the message: The note does not run. MessageBox.Show opens a small box with the words between the quote marks.
  [Line 5] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: btnHelpReactionTest]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out frmDataEntry and frmTest both have a btnHelpReactionTest. Each form keeps its own code, so the two do not clash.
Yours will be different Write YOUR test message in one line. It says what to do in the test.
Line above the big button: Done when lines 3 and 4 are typed and YOUR message is between the quote marks
[Big button at the foot: I've done this ✓]

## Part 5 of 5. Try it
Banner at the top of every screen in this part: "Part 5 of 5. You are testing your help buttons"

### Screen ch13#5-1. Try every help button
Run your program and then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. On the login form, click ?.
    How: YOUR login message shows. Click OK to close it.
    If not: Look at the code on screen 4-1.  [button: Go there ›]
  [tick box] Must happen. Log in. Click the ? in the pupil details panel.
    How: YOUR message for that panel shows.
    If not: Look at the code on screen 2-1.  [button: Go there ›]
  [tick box] Must happen. Work through the panels. Click each ? while its panel is on.
    How: Each panel shows its own message.
    If not: Look at the code on screens 3-1 to 3-4.  [button: Go there ›]
  [tick box] Must happen. Take the quiz and the test. Click the ? on each form.
    How: Each form shows its own message.
    If not: Look at the code on screens 4-2 and 4-3.  [button: Go there ›]
  [tick box] Must NOT happen. Click Calculate in the group panel. When the group appears, the panel goes grey. Click its ? now.
    How: Nothing must happen, because the whole panel is switched off.
    If not: If a message shows, look at the code on chapter 10, screen 3-8.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 13 is done ✓]

# Chapter 14. Push yourself: optional extras
Under the title: Four extras for anyone who wants more. None of them is needed.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Part 1 of 5. Read this first
Banner at the top of every screen in this part: "Part 1 of 5. You are learning which extra to pick"

### Screen ch14#1-1. Meet the four extras before you pick one
Everything your program needs is done, so this chapter is for fun.
Pick any one. Skip any one. Nothing here is marked.
Each extra says what it does, gives its code, then has its own Try it.
Watch out Save your project before you start an extra. Then you can always go back.
Line above the big button: Done when you have saved your project and picked an extra, or none
[Big button at the foot: Next ›]

## Part 2 of 5. Login: three tries, then no more
Banner at the top of every screen in this part: "Part 2 of 5. You are making three tries at login"

### Screen ch14#2-0. Make the login stop after three wrong tries
[Opening screen of this part, one card]
A counter remembers the wrong tries. On the third one a message shows and the Login button goes grey.
When it works, nobody can keep guessing the password for ever.
[Big button at the foot: Next ›]

### Screen ch14#2-1. Add a counter for wrong tries
Open frmLogin's code, where two places change.
Click the empty line above public frmLogin and type the line below.
[CODE CARD. Type this. A counter for wrong tries]
  Where: near the top of frmLogin's code, above the line public frmLogin
  private int tries = 0;
  [Line 1] A counter that starts at 0: A whole number called tries. It sits outside every button, so it keeps its value between clicks.
  [Names in this code: tries]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Type this line above public frmLogin, not inside btnLogin_Click. Inside the button, it would start again at 0 on every click.
Line above the big button: Done when line 1 is typed above public frmLogin and has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch14#2-2. Switch Login off on the third wrong try
Find the Login incorrect message near the bottom of btnLogin_Click.
Two lines below it, tbxPassword is cleared.
Click at the end of that tbxPassword line and press Enter.
[CODE CARD. Type this. Count the wrong tries]
  Where: near the bottom of btnLogin_Click, under the line that clears tbxPassword
  tries += 1;
  if (tries == 3)
  {
      MessageBox.Show("Three wrong tries. The Login button is now off.");
      btnLogin.Enabled = false;
  }
  [Line 1] One more wrong try: Add 1 to tries each time the login is wrong.
  [Lines 2 to 6] On the third, stop: When tries is 3, a message shows. Then the Login button goes grey.
  [Names in this code: tries, btnLogin]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Line above the big button: Done when lines 1 to 6 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch14#2-3. Try the three tries
Run your program and then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type a wrong password and click Login. Do it three times.
    How: On the third try, the message shows. The Login button goes grey.
    If not: Look at the code on screen 2-2.  [button: Go there ›]
  [tick box] Must NOT happen. After the third wrong try, type the right username and password.
    How: Login must NOT work, because the button is grey.
    If not: If it works, look at the code on screen 2-2.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I've done this ✓]

## Part 3 of 5. Reaction test: the swaps speed up
Banner at the top of every screen in this part: "Part 3 of 5. You are making the faster swaps"

### Screen ch14#3-0. Make the pictures swap faster as the clock runs down
[Opening screen of this part, one card]
The reaction test swaps its pictures once a second. This extra makes the swaps speed up as the clock runs down.
When it works, the test gets harder towards the end.
[Big button at the foot: Next ›]

### Screen ch14#3-1. Make the pictures swap faster each second
Open frmTest's code and find tmrCountdown_Tick.
Its first line takes 1 off CountdownValue.
Click at the end of that line and press Enter.
[CODE CARD. Type this. Faster swaps]
  Where: inside tmrCountdown_Tick, under the line that takes 1 off CountdownValue
  if (tmrSwap.Interval > 300)
  {
      tmrSwap.Interval = tmrSwap.Interval - 100;
  }
  [Lines 1 to 2] Still slower than 0.3 seconds?: Only when the gap between swaps is more than 300.
  [Lines 3 to 4] Take a tenth off: The gap gets 100 smaller. 100 is a tenth of a second.
  [Names in this code: tmrSwap]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different MY tmrSwap starts at 1000. If YOURS starts lower, it reaches 300 sooner.
Line above the big button: Done when lines 1 to 4 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch14#3-2. Try the faster swaps
Run your program, log in and take the test, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Watch the pictures as the clock counts down.
    How: The swaps get faster each second.
    If not: Look at the code on screen 3-1.  [button: Go there ›]
  [tick box] Must NOT happen. Watch the last few seconds.
    How: The pictures must NOT go too fast to click. They stay clear enough to click to the end.
    If not: If they go too fast, look at the code on screen 3-1.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I've done this ✓]

## Part 4 of 5. Data entry: the best attempt
Banner at the top of every screen in this part: "Part 4 of 5. You are making the best attempt"

### Screen ch14#4-0. Show the best of the three attempts
[Opening screen of this part, one card]
The average button already works out the average. This extra also finds the biggest of the three attempts and shows it.
When it works, the attempts heading shows the best attempt too.
[Big button at the foot: Next ›]

### Screen ch14#4-1. Show the best of the three attempts
Open frmDataEntry's code and find btnCalculateAverage_Click.
Click at the end of the line Global.attempt3 = and press Enter.
[CODE CARD. Type this. The best attempt]
  Where: inside btnCalculateAverage_Click, under the three Global.attempt lines
  int best = Global.attempt1;
  if (Global.attempt2 > best)
  {
      best = Global.attempt2;
  }
  if (Global.attempt3 > best)
  {
      best = Global.attempt3;
  }
  lblSwimLengths.Text = "Swim lengths (best: " + best + ")";
  [Line 1] Start with attempt 1: A whole number called best. It starts as attempt 1.
  [Lines 2 to 5] Is attempt 2 bigger?: When attempt 2 is bigger than best, best becomes attempt 2.
  [Lines 6 to 9] Is attempt 3 bigger?: When attempt 3 is bigger than best, best becomes attempt 3.
  [Line 10] Show it: The attempts heading now shows the best attempt.
  [Names in this code: best, Global.attempt1, Global.attempt2, Global.attempt3, lblSwimLengths]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Yours will be different MY heading says Swim lengths. Use the words on YOUR heading.
Line above the big button: Done when lines 1 to 10 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch14#4-2. Try the best attempt
Run your program, log in and enter the details, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type 5, 6 and 8 as the attempts. Click the average button.
    How: The heading says best: 8.
    If not: Look at the code on screen 4-1.  [button: Go there ›]
  [tick box] Must NOT happen. Run again. Type 5, 9 and 2. Click the average button.
    How: The heading must NOT say best: 2. It says best: 9.
    If not: If it says 2, look at the code on screen 4-1.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: I've done this ✓]

## Part 5 of 5. Data entry: colour the group
Banner at the top of every screen in this part: "Part 5 of 5. You are making the coloured group"

### Screen ch14#5-0. Turn the group panel green, yellow or red
[Opening screen of this part, one card]
The group panel already shows the group. This extra turns the panel green, yellow or red to match the group.
When it works, the group panel changes colour as the group appears.
[Big button at the foot: Next ›]

### Screen ch14#5-1. Turn the group panel green, yellow or red
Open frmDataEntry's code and find btnCalculateSwimmingGroup_Click.
Click at the end of the line Global.assignedGroup = and press Enter.
[CODE CARD. Type this. Colour the group panel]
  Where: inside btnCalculateSwimmingGroup_Click, under the Global.assignedGroup line and above the pnlSwimmingGroup.Enabled line
  if (Global.assignedGroup == "Advanced")
  {
      pnlSwimmingGroup.BackColor = Color.LightGreen;
  }
  else if (Global.assignedGroup == "Intermediate")
  {
      pnlSwimmingGroup.BackColor = Color.Khaki;
  }
  else
  {
      pnlSwimmingGroup.BackColor = Color.LightCoral;
  }
  [Lines 1 to 4] The top group is green: When the group is Advanced, the panel turns light green.
  [Lines 5 to 8] The middle group is yellow: else if asks a second question. When the group is Intermediate, the panel turns khaki, a soft yellow.
  [Lines 9 to 12] Every other group is red: else catches every other group. It turns the panel light red.
  [Names in this code: Global.assignedGroup, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
The panel still turns grey after Calculate. It keeps its new colour.
Yours will be different MY groups are Advanced and Intermediate. Use the group names on YOUR task sheet, spelled the same as in chapter 10.
Line above the big button: Done when lines 1 to 12 are typed and the code has no red squiggles
[Big button at the foot: I've done this ✓]

### Screen ch14#5-2. Try the coloured group
Run your program and do everything up to the group, then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Get all 5 quiz questions right. Click 6 winning pictures. Type 8, 8 and 8 as the attempts. Click Calculate.
    How: YOUR top group shows. The group panel turns green.
    If not: Look at the code on screen 5-1.  [button: Go there ›]
  [tick box] Must NOT happen. Run again. Get 1 quiz question right. Click 1 winning picture. Type 2, 2 and 2 as the attempts. Click Calculate.
    How: The panel must NOT be green. It turns light red.
    If not: If it is green, look at the code on screen 5-1.  [button: Go there ›]
Line above the big button: Done when every row is ticked, or you have gone where its link says
[Big button at the foot: Chapter 14 is done ✓]
