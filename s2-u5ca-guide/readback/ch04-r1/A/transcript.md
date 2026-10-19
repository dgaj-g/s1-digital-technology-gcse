# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 4. Pupil details: the Enter button
Under the title: Check the four boxes, keep them in Global.cs, switch off the panel.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your Enter button has

### Screen ch04#1-1. Check what your Enter button already does
Your Enter button may have some code already. This screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] In the Design tab, double-click the Enter button. Is there code between its curly brackets?
    How: The code tab opens at btnEnter_Click. Lines between the curly brackets mean yes.
    If not: Go to stage 2.  [button: Go there ›]
  [tick box] Does the first line inside it make an empty string called errors?
    How: Look at the line straight after the first curly bracket.
    If not: Go to stage 2.  [button: Go there ›]
  [tick box] Run it. Leave every box empty and press Enter. Does one message list what is missing?
    How: Use the green Start arrow. Log in first, then press Enter.
    If not: Go to stage 3.  [button: Go there ›]
  [tick box] Fill in all four and press Enter. Does the details panel go grey and the attempts panel wake up?
    How: Grey means switched off. Its boxes cannot be clicked.
    If not: Go to stage 3, screen 3.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. Collect every problem

### Screen ch04#2-1. Start an empty list of problems
The Enter button checks four things. A pupil could get more than one of them wrong.
So the code collects every problem first. Then it shows them all in one message.
Six new things in this chapter. Click any marked word to see what it means.
  string.IsNullOrWhiteSpace = Is this box empty, or only spaces?
  || = Or. Only one side needs to be true.
  += = Add this on to the end.
  \n = Start a new line.
  .SelectedIndex == -1 = Nothing is chosen in the drop-down list yet.
  Enabled = false = Switch it off. It goes grey and cannot be clicked.
STEP 1. In the Design tab, double-click the Enter button.
  You should see: The code tab opens at btnEnter_Click.
[CODE CARD. Type this. The Enter button, part 1 of 6]
  Where: between the curly brackets of btnEnter_Click, in frmDataEntry.cs
  [grey, already there] private void btnEnter_Click(object sender, EventArgs e)
  [grey, already there] {
      string errors = "";
  
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 4] An empty list of problems: errors is a string. It starts empty. Each problem found is added to it.
  [Names in this code: errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of string and picking it from the list]
Watch out The errors line goes first. Every check below adds to it.
[Big button at the foot: I've done this ✓]

### Screen ch04#2-2. Add a problem when a name box is empty
The first check asks: is either name box empty?
string.IsNullOrWhiteSpace asks if a box is empty or holds only spaces. || means or.
+= adds a line on to the end of errors. \n starts that line on a new line.
[CODE CARD. Type this. The Enter button, part 2 of 6]
  Where: under part 1, inside btnEnter_Click, in frmDataEntry.cs
      if (string.IsNullOrWhiteSpace(tbxSurname.Text) || string.IsNullOrWhiteSpace(tbxFirstName.Text))
      {
          //displays error message if surname or forename textboxes are left blank
          errors += "\nYou must enter a surname and forename";
      }
  [Lines 5 to 6] Is a name box empty?: Is the surname box empty, OR is the first name box empty?
  [Lines 7 to 9] Add the problem: A note for you, then a new line is added to errors.
  [Names in this code: tbxSurname, tbxFirstName, errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxSurname and picking it from the list]
Watch out Two straight lines make or. The key is next to Z on most keyboards. Hold Shift.
[Big button at the foot: I've done this ✓]

### Screen ch04#2-3. Add a problem when a name is too long or nothing is chosen
Two more checks. Is a name too long? Is a drop-down list left with nothing chosen?
.SelectedIndex == -1 asks if nothing is chosen. -1 means nothing is chosen yet.
[CODE CARD. Type this. The Enter button, part 3 of 6]
  Where: under part 2, inside btnEnter_Click, in frmDataEntry.cs
      if (tbxSurname.Text.Length > 20 || tbxFirstName.Text.Length > 20)
      {
          errors += "\nSurname and/or forename is too long";
      }
      if (cbxYeargroup.SelectedIndex == -1 || cbxGender.SelectedIndex == -1)
      {
          //displays error message if an option is nt selected in the gender or yeargroup comboboxes
          errors += "\nYou must select a gender and yeargroup";
      }
  [Lines 10 to 13] Too long?: Is either name more than 20 letters? If so, add a line to errors.
  [Lines 14 to 18] Nothing chosen?: Is nothing chosen for year group OR gender? A note, then a line is added.
  MY longest name is 20 letters. Use the number YOUR task sheet gives.
  [Names in this code: tbxSurname, tbxFirstName, cbxYeargroup, cbxGender, errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxYeargroup and picking it from the list]
Watch out Leave the spelling mistakes in the notes. The computer skips notes.
[Big button at the foot: I've done this ✓]

## Stage 3. Show the problems or keep the details

### Screen ch04#3-1. Show every problem in one message
Now every check is done. If errors holds anything, there was a problem.
errors.Length counts its characters. More than 0 means something was added.
[CODE CARD. Type this. The Enter button, part 4 of 6]
  Where: under part 3, inside btnEnter_Click, in frmDataEntry.cs
      if (errors.Length > 0)
      {
          MessageBox.Show(errors);
      }
  [Lines 19 to 22] Any problems? Show them: If errors is not empty, a message box shows every line in it.
  [Names in this code: errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of string and picking it from the list]
Watch out There is one message box, not three. It shows every problem at once.
[Big button at the foot: I've done this ✓]

### Screen ch04#3-2. Keep the four details in Global.cs
else runs when errors is empty. That means every box was filled in right.
So the four details are kept in Global.cs. Every form can read them from there.
[CODE CARD. Type this. The Enter button, part 5 of 6]
  Where: under part 4, inside btnEnter_Click, in frmDataEntry.cs
      else
      {
          //disables details panel and enables quiz result panel
          Global.surname = tbxSurname.Text;
          Global.firstname = tbxFirstName.Text;
          Global.gender = cbxGender.SelectedItem.ToString();
          Global.yearGroup = cbxYeargroup.SelectedItem.ToString();
  [Lines 23 to 25] No problems: else, then a note for you.
  [Lines 26 to 29] Keep the four details: Each one goes into its line in Global.cs.
  [Names in this code: Global.surname, tbxSurname, Global.firstname, tbxFirstName, Global.gender, cbxGender, Global.yearGroup, cbxYeargroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of Global.surname and picking it from the list]
Watch out Leave the last curly bracket of else where it is. Part 6 goes above it.
[Big button at the foot: I've done this ✓]

### Screen ch04#3-3. Switch off the details panel and switch on the attempts panel
Last, the Enter button moves the pupil on. Enabled = false switches a panel off.
[Animated diagram of frmDataEntry. Panels switched on: pnlPupilDetails. Then pnlSwimLengths switches on.]
  Caption first: The details are filled in right. Enter is pressed.
  Caption: The details panel goes grey and switches off. The attempts panel switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. The Enter button, part 6 of 6]
  Where: under part 5, inside the else of btnEnter_Click
          pnlSwimLengths.Enabled = true; //this was changed
          pnlPupilDetails.Enabled = false;
  [grey, already there]     }
  [grey, already there] 
  [grey, already there] }
  [Lines 30 to 31] Move to the next panel: The attempts panel switches on. The details panel switches off.
  [Lines 32 to 34] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlSwimLengths, pnlPupilDetails]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlSwimLengths and picking it from the list]
[Big button at the foot: I've done this ✓]

## Stage 4. Try your Enter button

### Screen ch04#4-1. Try every way through the Enter button
Run your program and log in. Then try each row. A row that fails tells you where to look.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Leave every box empty and press Enter.
    How: One message lists every missing thing, each on its own line.
    If not: Look at parts 2 and 3 on screens 2-2 and 2-3.  [button: Go there ›]
  [tick box] Must happen. Type a surname of 21 letters. Fill in the rest. Press Enter.
    How: The message says the name is too long.
    If not: Look at part 3 on screen 2-3.  [button: Go there ›]
  [tick box] Must happen. Fill in all four and press Enter.
    How: The details panel goes grey. The attempts panel can be clicked.
    If not: Look at part 6 on screen 3-3.  [button: Go there ›]
  [tick box] Must NOT happen. After that, click in the surname box and try to type.
    How: You must NOT be able to type in it.
    If not: If you can, look at part 6 on screen 3-3.  [button: Go there ›]
[Big button at the foot: Chapter 4 is done ✓]
