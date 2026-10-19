# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 6. The quiz: the first three questions
Under the title: Get to the quiz, then mark a typed answer, two buttons and a list.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your quiz has

## Stage 2. The quiz form: its panels and buttons

### Screen ch06#2-3. Fill the question 2 and question 3 panels
Question 2 is answered with one of two buttons. Question 3 is answered from a drop-down list.
[Table of controls for frmQuiz. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblQuestion2 (the words of question 2) | Text = question 2
  Button | btnCorrect (the button of question 2 that is the right answer) | Text = the right answer
  Button | btnIncorrect (the button of question 2 that is the wrong answer) | Text = a wrong answer
  Label | lblQuestion3 (the words of question 3) | Text = question 3
  PictureBox | pbxQuestion3 (the picture that question 3 asks about) | Image = a picture for question 3
  ComboBox | cbxQuestion3 (the drop-down list where question 3 is answered) | Items = the choices, one per line
  Button | btnCheck3 (the Check button of question 3) | Text = Check
  You should see: The first three sit inside pnlButtonsQuestion. The last four sit inside pnlListQuestion.
For Image, click the three dots beside it. Click Import, pick YOUR picture, then click OK.
Items works as it did for the year group list in chapter 2.
Watch out Put the RIGHT answer first in the Items list. The code on screen 5-4 looks for it there.
[Big button at the foot: I've done this ✓]

### Screen ch06#2-4. Fill the question 4 and question 5 panels
Question 4 has four answers. Only one can be picked. Question 5 is answered with a number.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Drag a group box, round buttons and a number box]
    picture 1: Drag a GroupBox into the question 4 panel.
    picture 2: Drag four RadioButtons INSIDE the group box.
    picture 3: Drag a NumericUpDown into the question 5 panel.
[Table of controls for frmQuiz. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  GroupBox | gbQuestion4 (question 4's group box of radio buttons) | Text = question 4
  RadioButton | rbA (the first radio button of question 4) | Text = answer A
  RadioButton | rbB (the second radio button of question 4) | Text = answer B
  RadioButton | rbC (the third radio button of question 4) | Text = answer C
  RadioButton | rbD (the fourth radio button of question 4) | Text = answer D
  Button | btnCheck4 (the Check button of question 4) | Text = Check
  Label | lblQuestion5 (the words of question 5) | Text = question 5
  NumericUpDown | nudQuestion5 (question 5's number box with arrows) | Nothing else to set
  Button | btnCheck5 (the Check button of question 5) | Text = Check
  You should see: The group box sits in pnlRadioQuestion, with the next five inside it. The last three sit inside pnlNumberQuestion.
Watch out The four round buttons and btnCheck4 go INSIDE the group box. Then only one round button can be picked.
[Big button at the foot: I've done this ✓]

## Stage 3. Getting to the quiz

### Screen ch06#3-1. Open the quiz from the Take quiz button
The Take quiz button is on the data entry form. It swaps that form for the quiz.
Four new things in this chapter. Click any marked word to see what it means.
  this.Close() = Close this form for good.
  new frmQuiz().Show() = Make a new quiz form and show it.
  .ToLower() = Turn every letter into a small letter.
  BackColor = The background colour of a control.
[Animated picture: The data entry form fades away. The quiz form appears in its place.]  Caption: The data entry form closes. The quiz form opens.
STEP 1. Open frmDataEntry in the Design tab. Double-click the Take quiz button.
  You should see: The code tab opens at btnTakeQuiz_Click.
[CODE CARD. Type this. The Take quiz button]
  Where: between the curly brackets of btnTakeQuiz_Click
  [grey, already there] private void btnTakeQuiz_Click(object sender, EventArgs e)
  [grey, already there] {
      //closes frmDataEntry and loads frmQuiz
      this.Close();
      new frmQuiz().Show();
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Close this form, open the quiz: A note for you. The data entry form closes. A new quiz form opens.
  [Line 6] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: frmQuiz]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of frmQuiz and picking it from the list]
this.Close() closes the data entry form. new frmQuiz().Show() makes the quiz and shows it.
Watch out The data entry form forgets everything when it closes. That is why the details are kept in Global.cs, the file from chapter 3.
[Big button at the foot: I've done this ✓]

## Stage 4. Question 1: a typed answer

### Screen ch06#4-2. Switch off question 1 and switch on question 2
Right or wrong, the quiz moves on. Question 1 switches off. Question 2 switches on.
[Animated diagram of frmQuiz. Panels switched on: pnlTextQuestion. Then pnlButtonsQuestion switches on.]
  Caption first: Question 1 is marked.
  Caption: The question 1 panel switches off. The question 2 panel switches on.
  Under it: A switched-off panel is grey. Nothing in it can be clicked. Enabled = false switches it off. Enabled = true switches it on.
[CODE CARD. Type this. Question 1's Check button, part 2 of 2]
  Where: under part 1, inside btnCheck1_Click, in frmQuiz.cs
      pnlTextQuestion.Enabled = false;
      pnlButtonsQuestion.Enabled = true;
  [grey, already there] 
  [grey, already there] }
  [Lines 13 to 14] Move to the next question: Question 1 switches off. Question 2 switches on.
  [Lines 15 to 16] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlTextQuestion, pnlButtonsQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlButtonsQuestion and picking it from the list]
Watch out Type these two lines under the last curly bracket of the else. They run for a right answer and a wrong one.
[Big button at the foot: I've done this ✓]

## Stage 5. Questions 2 and 3

## Stage 6. Try your first three questions
