# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 11. Save the details to the file
Under the title: Put one line in the file, clear Global.cs, start again.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what you need first

### Screen ch11#1-1. Check the parts this chapter needs
This chapter uses work from earlier chapters. This screen checks that it is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is chapter 10 done, so a group appears when you click Calculate?
    How: Run the program. Do every part, then click Calculate.
    If not: Go to chapter 10.  [button: Go there ›]
  [tick box] Is there a Save button under the panels, named btnSaveDetails?
    How: Open frmDataEntry in the Design tab. Click the Save button and look at its Name.
    If not: Go to chapter 2, stage 3.  [button: Go there ›]
  [tick box] Does Global.cs have all fourteen names?
    How: Double-click Global.cs in Solution Explorer. Count the lines that start with public static.
    If not: Go to chapter 3, stage 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. The file tools

### Screen ch11#2-1. Type one line at the very top
Open frmDataEntry's code. Scroll to the very top. Click at the end of the last using line and press Enter.
[CODE CARD. Type this. One line at the top]
  Where: under the other using lines, at the very top of frmDataEntry's code
  using System.IO;
  [Line 1] The file tools: It lets this form use File, which writes to a file.
  [Names in this code: System.IO]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Without using System.IO the word File goes red.
Four new words in this chapter. Click a marked word to see what it means.
  using System.IO = A line at the top that lets the form use the file tools.
  ~ = A wavy line. It sits between the pieces of a line, like a fence.
  Environment.NewLine = The end of a line. The next words start on a new line.
  File.AppendAllText = Adds words to the end of a file. It makes the file if it is not there.
[Fold-out box, closed until clicked: See where it goes]
  [Picture strip: The using line at the top]
    picture 1: The new line sits under the other using lines.
[Big button at the foot: I've done this ✓]

## Stage 3. Only when everything is done

### Screen ch11#3-1. Type the if first
In the Design tab, double-click the Save button. A grey panel is a part that is done.
[CODE CARD. Type this. The Save button, part 1 of 6]
  Where: between the curly brackets of btnSaveDetails_Click
  [grey, already there] private void btnSaveDetails_Click(object sender, EventArgs e)
  [grey, already there] {
      if(pnlSwimLengths.Enabled == false && pnlReactionTest.Enabled == false && pnlQuizResult.Enabled == false && pnlPupilDetails.Enabled == false && pnlSwimmingGroup.Enabled == false)
      {
  
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Line 3] Are all five panels grey?: One long line. && means and. All five must be switched off.
  [Lines 4 to 6] Room inside: A curly bracket, then two empty lines. The saving goes here later.
  [Names in this code: pnlSwimLengths, pnlReactionTest, pnlQuizResult, pnlPupilDetails, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Line 3 is one long line. Keep it on one line in Visual Studio.
[Big button at the foot: I've done this ✓]

### Screen ch11#3-2. Close the if and add the else
Click on the second empty line inside the if. Leave both empty lines there.
[CODE CARD. Type this. The Save button, part 2 of 6]
  Where: under the two empty lines inside the if
  
  
      }
      else
      {
          MessageBox.Show("Not all results or student data has been saved yet");
          return;
      }
  
  [grey, already there] }
  [Lines 46 to 48] End the if: Two empty lines, then the curly bracket that ends the if.
  [Lines 49 to 53] Not done? Say so and stop: else runs when a panel is still on. A message shows and return stops the code.
  [Line 54] An empty line: Leave one empty line here.
  [Line 55] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
Watch out The saving goes on the empty lines inside the if. The next screens fill them.
[Big button at the foot: I've done this ✓]

## Stage 4. Write the line to the file

### Screen ch11#4-1. Build one line with fences
Click on the first empty line inside the if. Each ~ is a fence between two pieces.
[CODE CARD. Type this. The Save button, part 3 of 6]
  Where: on the first empty line inside the if of btnSaveDetails_Click
          //create the string with each value separated by '~'
          string record = Global.surname + "~" +
          Global.firstname + "~" +
          Global.quizScore.ToString() + "~" +
          Global.yearGroup + "~" +
          Global.gender + "~" +
          Global.average.ToString() + "~" +
          Global.attempt1.ToString() + "~" +
          Global.attempt2.ToString() + "~" +
          Global.attempt3.ToString() + "~" +
          Global.reactionTestScore.ToString() +"~" +
          Global.assignedGroup;
  [Line 7] A note: A note about the fences. It does not run.
  [Lines 8 to 12] The first five pieces: Surname, first name, quiz score, year group and gender, each followed by a ~.
  [Lines 13 to 18] The last six pieces: The average, the three attempts, the test score and the group.
  [Names in this code: record, Global.surname, Global.firstname, Global.quizScore, Global.yearGroup, Global.gender, Global.average, Global.attempt1, Global.attempt2, Global.attempt3, Global.reactionTestScore, Global.assignedGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Animated picture: The line Smith~Anna~4~12~F~6.33~5~6~8~5~Advanced. Each piece has its own colour and a number from 0 to 10.]  Caption: The order matters. The report reads the pieces back in this order.
[Big button at the foot: I've done this ✓]

### Screen ch11#4-2. End the line and write the file
Environment.NewLine ends the line. File.AppendAllText adds it to the end of the file.
[CODE CARD. Type this. The Save button, part 4 of 6]
  Where: under part 3, inside the if of btnSaveDetails_Click
  
          //Append a new line so that each new record stats a new line
          record += Environment.NewLine;
  
          //Append the text to the file 'pupilStats' (creates the file if it doesn't exist)
          File.AppendAllText("pupilStats.txt", record);
  
          MessageBox.Show("Data saved successfully. \n you can enter details for another student");
  
  [Lines 19 to 21] End the line: An empty line and a note. Then the end of a line is added to record.
  [Lines 22 to 24] Write it to the file: An empty line and a note. Then record goes on the end of the file.
  [Lines 25 to 27] Say it is saved: A message tells the pupil it worked. Empty lines sit either side.
  MY file is pupilStats.txt. Choose YOUR file's name now and keep it. The report needs the same name.
  [Names in this code: record, Environment.NewLine, File.AppendAllText]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch11#4-3. Clear Global.cs, first half
Global.cs still holds this pupil's details. Clear them, so the next pupil starts empty.
[CODE CARD. Type this. The Save button, part 5 of 6]
  Where: under part 4, inside the if of btnSaveDetails_Click
          //Reset the Global variables after saving the data 
          Global.surname = "";
          Global.firstname = "";
          Global.quizScore = 0;
          Global.yearGroup = "";
          Global.gender = "";
          Global.averageCalculated = false;
          Global.average = 0;
  [Line 28] A note: A note about clearing. It does not run.
  [Lines 29 to 33] Empty words: Words go back to two speech marks with nothing between them.
  [Lines 34 to 35] Back to the start: averageCalculated goes back to false. The average goes back to 0.
  [Names in this code: Global.surname, Global.firstname, Global.quizScore, Global.yearGroup, Global.gender, Global.averageCalculated, Global.average]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch11#4-4. Clear the rest and start again
Each number goes back to 0. Each true or false goes back to false.
[CODE CARD. Type this. The Save button, part 6 of 6]
  Where: under part 5, inside the if of btnSaveDetails_Click
          Global.attempt1 = 0;
          Global.attempt2 = 0;
          Global.attempt3 = 0;
          Global.reactionTestScore = 0;
          Global.reactionTestTaken = false;
          Global.quizTaken = false;
          Global.assignedGroup = "";
  
          this.Close();
          new frmDataEntry().Show();
  [Lines 36 to 42] The other seven: The attempts, the test, the two true or false names and the group.
  [Lines 43 to 45] Start again: An empty line. Then this form closes and a fresh one opens.
  [Names in this code: Global.attempt1, Global.attempt2, Global.attempt3, Global.reactionTestScore, Global.reactionTestTaken, Global.quizTaken, Global.assignedGroup, frmDataEntry]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of frmDataEntry and picking it from the list]
[Animated picture: The data entry form, fresh and empty, beside Global.cs.]  Caption: The file keeps the line. The form starts fresh for the next pupil.
[Big button at the foot: I've done this ✓]

## Stage 5. Try it

### Screen ch11#5-1. Try your Save button
Run your program. Log in and do every part. Click Calculate. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Click Save.
    How: The saved message shows. Then a fresh data entry form opens.
    If not: Look at screens 4-2 and 4-4.  [button: Go there ›]
  [tick box] Must happen. Stop the program. Find the Debug folder. Look for YOUR file.
    How: YOUR file is there, next to the program.
    If not: Look at screen 4-2.  [button: Go there ›]
  [tick box] Must happen. Double-click YOUR file. It opens in Notepad.
    How: One line, with a ~ between each piece.
    If not: Look at screen 4-1.  [button: Go there ›]
  [tick box] Must happen. Run again and save a second pupil. Open the file again.
    How: Two lines. The second pupil is on the second line.
    If not: Look at screen 4-2.  [button: Go there ›]
  [tick box] Must NOT happen. Log in and click Save straight away.
    How: The not all results message shows. NO line is added to the file.
    If not: Look at screens 3-1 and 3-2.  [button: Go there ›]
[Fold-out box, closed until clicked: Find the file]
  [Picture strip: Find the Debug folder]
    picture 1: Right-click the project. Click Open Folder in File Explorer.
    picture 2: Double-click bin.
    picture 3: Double-click Debug.
[Fold-out box, closed until clicked: See the file]
  [Picture strip: The file after the first save]
    picture 1: The file is in the Debug folder.
    picture 2: One line, with a ~ between each piece.
[Big button at the foot: Chapter 11 is done ✓]
