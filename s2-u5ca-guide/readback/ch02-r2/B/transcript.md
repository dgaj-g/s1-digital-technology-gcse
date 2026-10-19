# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 2. The data entry form: its panels and boxes
Under the title: Five panels, two buttons, and a name on every control.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your data entry form has

## Stage 2. The five panels

### Screen ch02#2-2. Put on the five panels and name each one
Make the panels first. The boxes and buttons go inside them on the next screens.
STEP 1. In Solution Explorer, double-click frmDataEntry. It opens in the Design tab.
  You should see: The data entry form, empty or partly made.
STEP 2. Drag a Panel from the Toolbox onto the form. The Toolbox is down the left side. Drag the corner to make it bigger.
  You should see: A box with a dotted edge sits on the form.
STEP 3. Click the panel's edge once. In Properties, find the word Name. Type its new name and press Enter.
  You should see: The Name line shows the new name, like pnlPupilDetails.
  If it goes wrong Clicking the middle picks the wrong thing. -> Click the dotted EDGE of the panel, not the middle.
STEP 4. Do the same for the other four panels.
  You should see: Five panels, each with a name that starts with pnl.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Give a control its name]
    picture 1: Click the control once. Little squares appear round it.
    picture 2: In Properties, find the word Name. It is near the top of the list.
    picture 3: Type the new name and press Enter.
Watch out MY panel names are pnlPupilDetails, pnlSwimLengths, pnlQuizResult, pnlReactionTest and pnlSwimmingGroup. Name YOURS for what they hold.
[Big button at the foot: I've done this ✓]

## Stage 3. Inside each panel

### Screen ch02#3-1. Fill the pupil details panel
The first panel holds the pupil's name, gender and year group. Drag each row INSIDE pnlPupilDetails.
A ComboBox is a drop-down list. DropDownList means the user can only pick. They cannot type their own.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblPupilDetails (the heading of the pupil details panel) | Text = Pupil Details
  Label | lblFirstName (the label beside the first name box) | Text = First Name
  TextBox | tbxFirstName (the box where the first name is typed) | Nothing else to set
  Label | lblSurname (the label beside the surname box) | Text = Surname
  TextBox | tbxSurname (the box where the surname is typed) | Nothing else to set
  Label | lblGender (the label beside the gender list) | Text = Gender
  ComboBox | cbxGender (the drop-down list for gender) | DropDownStyle = DropDownList
  Label | lblYeargroup (the label beside the year group list) | Text = Yeargroup
  ComboBox | cbxYeargroup (the drop-down list for year group) | DropDownStyle = DropDownList
  Button | btnEnter (the Enter button under the pupil details) | Text = Enter
  Button | btnHelpPupilDetails (the ? button in the pupil details panel) | Text = ?
  You should see: Two boxes, two drop-down lists, their labels and two buttons sit inside the pupil details panel.
[Big button at the foot: I've done this ✓]

### Screen ch02#3-3. Fill the three attempts panel
The second panel holds three attempts and their average. Drag each row INSIDE pnlSwimLengths.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblSwimLengths (the heading of the attempts panel) | Text = Swim lengths
  Label | lblAttempt1 (the label beside attempt 1) | Text = Attempt 1
  TextBox | tbxAttempt1 (the box for attempt 1) | Nothing else to set
  Label | lblAttempt2 (the label beside attempt 2) | Text = Attempt 2
  TextBox | tbxAttempt2 (the box for attempt 2) | Nothing else to set
  Label | lblAttempt3 (the label beside attempt 3) | Text = Attempt 3
  TextBox | tbxAttempt3 (the box for attempt 3) | Nothing else to set
  Button | btnCalculateAverage (the Calculate Average button) | Text = Calculate Average
  TextBox | tbxCalculateAverage (the box that shows the average) | Nothing else to set
  Button | btnHelpSwimLengths (the ? button in the attempts panel) | Text = ?
  You should see: Three attempt boxes, the average box and two buttons sit inside the second panel.
The Calculate Average button does nothing yet. You make it work in chapter 5.
[Big button at the foot: I've done this ✓]

### Screen ch02#3-4. Fill the quiz panel and the reaction test panel
These two panels look alike. Each one has a heading, a line that says not taken yet, and two buttons.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblQuizResult (the heading of the quiz panel) | Text = Quiz Result
  Label | lblQuizStatus (the label that says whether the quiz has been taken) | Text = Quiz not taken yet
  Button | btnTakeQuiz (the Take Quiz button) | Text = Take Quiz
  Button | btnHelpQuizResult (the ? button in the quiz panel) | Text = ?
  Label | lblReactionTest (the heading of the test panel) | Text = Reaction Test
  Label | lblTestStatus (the label that says whether the test has been taken) | Text = Test not taken yet
  Button | btnTakeTest (the Take Test button) | Text = Take Test
  Button | btnHelpReactionTest (the ? button in the test panel) | Text = ?
  You should see: The first four rows sit inside pnlQuizResult. The last four sit inside pnlReactionTest.
Watch out The first four rows go in the QUIZ panel. The last four go in the TEST panel.
[Big button at the foot: I've done this ✓]

### Screen ch02#3-5. Fill the group panel and add the two big buttons
The first four rows go INSIDE pnlSwimmingGroup. The rest sit on the form, outside every panel.
[Table of controls for frmDataEntry. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblSwimmingGroup (the heading of the group panel) | Text = Swimming Group
  TextBox | tbxSwimmingGroup (the box that shows the group) | Nothing else to set
  Button | btnCalculateSwimmingGroup (the button that works out the group) | Text = Calculate Swim Group
  Button | btnHelpSwimmingGroup (the ? button in the group panel) | Text = ?
  Button | btnSaveDetails (the Save Details button) | Text = Save Details
  Button | btnViewReport (the View Report button) | Text = View Report
  Label | lblTitle2 (the title at the top of the data entry form) | Text = Pupil Data Input
  PictureBox | pbxLogo3 (a picture box with a logo) | SizeMode = StretchImage
  You should see: Four rows sit inside the group panel. Two big buttons, the title and the logo sit on the form.
A PictureBox shows a picture. StretchImage makes the picture fill the whole box.
To put a picture in the logo, click the three dots beside Image in Properties.
Every ? button has a name that starts btnHelp. You make them all work in chapter 13.
[Big button at the foot: I've done this ✓]

## Stage 4. Try it in the Design tab
