# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 6. The quiz: the first three questions
Under the title: Get to the quiz, then mark a typed answer, two buttons and a list.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Check what your quiz has

### Screen ch06#1-1. Check what your quiz already has
Your quiz may be partly made already. This screen checks what is there.
[List of checks: Have you got this?]  Open your project in the Programming Environment and look. Tick each row you have. A row you have not got tells you where to go.
  [tick box] Is frmQuiz in Solution Explorer? Does it hold a score panel and five question panels?
    How: Double-click frmQuiz in Solution Explorer. It opens in the Design tab.
    If not: Go to stage 2.  [button: Go there ›]
  [tick box] Does question 4 have four round buttons and a Check button? Does question 5 have a number box?
    How: Click each control once. Its name shows near the top of Properties.
    If not: Go to stage 2, screen 4.  [button: Go there ›]
  [tick box] Run it. Does the Take quiz button open the quiz?
    How: Use the green Start arrow. Log in and fill in the data entry form first.
    If not: Go to stage 3.  [button: Go there ›]
  [tick box] Answer question 1 and press Check. Does its panel turn green or red?
    How: Green means right. Red means wrong.
    If not: Go to stage 4.  [button: Go there ›]
  [tick box] Do question 2's buttons and question 3's list mark the answer?
    How: Try each one. The panel should turn green or red.
    If not: Go to stage 5.  [button: Go there ›]
[Big button at the foot: I have all these ✓]

## Stage 2. The quiz form: its panels and buttons

### Screen ch06#2-1. Add the quiz form and its six panels
The quiz is a form of its own. It holds a score panel and five question panels.
STEP 1. Click the Project menu along the top. Click the line that starts Add Form.
  You should see: A box opens with Form picked in its list.
  If it goes wrong I cannot see that line. -> Click your project's name in Solution Explorer first. Then open the Project menu again.
STEP 2. In the Name box at the bottom, type frmQuiz.cs. Click Add.
  You should see: frmQuiz opens in the Design tab. It is empty.
STEP 3. Drag six panels from the Toolbox onto it. Name each one as the map shows.
  You should see: Six panels, each with a name that starts with pnl.
[Fold-out box, closed until clicked: See it in Visual Studio]
  [Picture strip: Add a new form]
    picture 1: Open the Project menu. Click the line that starts Add Form.
    picture 2: Form is picked. Type the form's name in the Name box.
    picture 3: Click Add. The new form opens in the Design tab.
[Animated map of frmQuiz. Each panel lights up in turn, labelled with its name: pnlQuizScore, pnlTextQuestion, pnlButtonsQuestion, pnlListQuestion, pnlRadioQuestion, pnlNumberQuestion]
  Caption: Six panels. One holds the score. Each of the other five holds one question.
Each panel is named for what is in it, not a number. So YOUR quiz can put its questions in any order.
[Big button at the foot: I've done this ✓]

### Screen ch06#2-2. Fill the score panel and the question 1 panel
Drag each control into its panel. Then give it its name and its Text.
[Table of controls for frmQuiz. Columns: Drag this from the Toolbox | Its name in MY example | Then set this in Properties]
  Label | lblQuiz (the big Quiz title) | Text = Quiz
  Label | lblComment (the small line of words under the title) | Text = a line to start the quiz
  Label | lblScore (the label that says Score:) | Text = Score:
  Label | lblResult (the label that shows the score as a number) | Text = 0
  Button | btnReturn (the score panel's Return button) | Text = Return
  Button | btnHelpQuizScore (the ? button in the score panel) | Text = ?
  Label | lblQuestion1 (the words of question 1) | Text = question 1
  TextBox | tbxQuestion1 (the text box where question 1 is answered) | Nothing else to set
  Button | btnCheck1 (the Check button of question 1) | Text = Check
  You should see: The first six sit inside pnlQuizScore. The last three sit inside pnlTextQuestion.
Yours will be different MY questions are about water safety. Type YOUR five questions into the Text of each question label.
[Big button at the foot: I've done this ✓]

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
Watch out The round buttons go INSIDE the group box. Then only one of them can be picked.
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
Watch out The data entry form forgets everything when it closes. That is why the details are kept in Global.cs.
[Big button at the foot: I've done this ✓]

## Stage 4. Question 1: a typed answer

### Screen ch06#4-1. Mark the typed answer to question 1 right or wrong
Question 1 is typed in a box. Its Check button marks it.
.ToLower() turns every letter small. So EMERGENCY and Emergency both match.
BackColor is the background colour of a panel. Green means right. Red means wrong.
STEP 1. Open frmQuiz in the Design tab. Double-click the Check button of question 1.
  You should see: The code tab opens at btnCheck1_Click.
[CODE CARD. Type this. Question 1's Check button, part 1 of 2]
  Where: between the curly brackets of btnCheck1_Click
  [grey, already there] private void btnCheck1_Click(object sender, EventArgs e)
  [grey, already there] {
      if (tbxQuestion1.Text.ToLower() == "emergency")
      {
          Global.quizScore += 1;
          pnlTextQuestion.BackColor = Color.Green;
          lblResult.Text = Global.quizScore.ToString();
      }
      else
      {
          pnlTextQuestion.BackColor = Color.Red;
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 8] Right?: Is the answer, in small letters, emergency? Then add 1, turn the panel green and show the score.
  [Lines 9 to 12] Wrong: Any other answer turns the panel red.
  MY answer is emergency. Type YOUR answer, all in small letters.
  [Names in this code: tbxQuestion1, Global.quizScore, pnlTextQuestion, lblResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of tbxQuestion1 and picking it from the list]
[Big button at the foot: I've done this ✓]

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
Watch out These two lines go under the else, not inside it. They run for a right answer and a wrong one.
[Big button at the foot: I've done this ✓]

## Stage 5. Questions 2 and 3

### Screen ch06#5-1. Score a point when the right button is pressed
Question 2 has two buttons. Each button has its own code. Only the right button adds a point.
STEP 1. In the Design tab, double-click the right answer button of question 2.
  You should see: The code tab opens at btnCorrect_Click.
[CODE CARD. Type this. The right answer button]
  Where: between the curly brackets of btnCorrect_Click
  [grey, already there] private void btnCorrect_Click(object sender, EventArgs e)
  [grey, already there] {
      //If question is answred correctly, score incremented by 1, panel 2 is disabled and panel 3 is enabled
      Global.quizScore += 1;
      lblResult.Text = Global.quizScore.ToString();
      pnlButtonsQuestion.BackColor = Color.Green;
      pnlButtonsQuestion.Enabled = false;
      pnlListQuestion.Enabled = true;
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 5] Add a point: A note for you. Then 1 is added to the score, and the score is shown.
  [Lines 6 to 8] Green, then move on: The panel turns green. Question 2 switches off. Question 3 switches on.
  [Line 9] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  Which of YOUR two buttons is the right answer? Only that one scores.
  [Names in this code: Global.quizScore, lblResult, pnlButtonsQuestion, pnlListQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlListQuestion and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch06#5-2. Turn question 2 red when the wrong button is pressed
The wrong button does the same, with two changes. It adds no point, and the panel turns red.
STEP 1. In the Design tab, double-click the wrong answer button of question 2.
  You should see: The code tab opens at btnIncorrect_Click.
[CODE CARD. Type this. The wrong answer button]
  Where: between the curly brackets of btnIncorrect_Click
  [grey, already there] private void btnIncorrect_Click(object sender, EventArgs e)
  [grey, already there] {
      //if question is answered incorrectly, background changes red, panel 2 is disabled and panel three is enabled
      pnlButtonsQuestion.BackColor = Color.Red;
      pnlButtonsQuestion.Enabled = false;
      pnlListQuestion.Enabled = true;
  [grey, already there] }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 6] Red, then move on: A note for you. The panel turns red. Question 2 switches off. Question 3 switches on.
  [Line 7] Visual Studio wrote this line: This curly bracket is the end. Your code goes above it.
  [Names in this code: pnlButtonsQuestion, pnlListQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlButtonsQuestion and picking it from the list]
Watch out Each button has its own curly brackets. Type this code in btnIncorrect_Click, not in btnCorrect_Click.
[Big button at the foot: I've done this ✓]

### Screen ch06#5-3. Stop question 3 when nothing is chosen
Question 3 is a drop-down list. A user could press Check with nothing chosen.
.SelectedIndex == -1 asks if nothing is chosen. You met it in chapter 4.
STEP 1. In the Design tab, double-click the Check button of question 3.
  You should see: The code tab opens at btnCheck3_Click.
[CODE CARD. Type this. Question 3's Check button, part 1 of 3]
  Where: between the curly brackets of btnCheck3_Click
  [grey, already there] private void btnCheck3_Click(object sender, EventArgs e)
  [grey, already there] {
      if (cbxQuestion3.SelectedIndex == -1)
      {
          //if question 3 is left null, message appear, 'Please ensure you've made a choice, no choice made'
          MessageBox.Show("Please ensure you've made a choice", "No choice made!");
      }
  [Lines 1 to 2] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Lines 3 to 7] Nothing chosen?: If nothing is chosen, a note for you, then a message asks the user to choose.
  [Names in this code: cbxQuestion3]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxQuestion3 and picking it from the list]
Watch out With nothing chosen, nothing else happens. The list stays switched on so the user can choose.
[Big button at the foot: I've done this ✓]

### Screen ch06#5-4. Score a point when the right item is chosen
else runs when something is chosen. Then the code asks: is it the right item?
The items are counted from 0. So the first item is number 0.
[CODE CARD. Type this. Question 3's Check button, part 2 of 3]
  Where: under part 1, inside btnCheck3_Click
      else
      {
          if (cbxQuestion3.SelectedIndex == 0)
          {
              //if question is answered correctly, panel backcolor changes to green
              Global.quizScore += 1;
              pnlListQuestion.BackColor = Color.Green;
              lblResult.Text = Global.quizScore.ToString();
          }
  [Lines 8 to 9] Something is chosen: else, then its curly bracket.
  [Lines 10 to 16] Right?: Is item 0 chosen? A note, then add 1, turn the panel green and show the score.
  MY right answer is the first item in the list, number 0. Count YOUR list from 0.
  [Names in this code: cbxQuestion3, Global.quizScore, pnlListQuestion, lblResult]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of cbxQuestion3 and picking it from the list]
[Big button at the foot: I've done this ✓]

### Screen ch06#5-5. Turn question 3 red, then switch on question 4
Last, a wrong item turns the panel red. Then the quiz moves on to question 4.
[CODE CARD. Type this. Question 3's Check button, part 3 of 3]
  Where: under part 2, inside btnCheck3_Click
          else
          {
              //if question answered incorrectly, panel backcolor changes to red
              pnlListQuestion.BackColor = Color.Red;
          }
          //Question 3 is disabled and panel 4 is enabled
          pnlListQuestion.Enabled = false;
          pnlRadioQuestion.Enabled = true;
  [grey, already there]     }
  [grey, already there] }
  [Lines 17 to 21] Wrong: Any other item. A note, then the panel turns red.
  [Lines 22 to 24] Move to the next question: A note. Question 3 switches off. Question 4 switches on.
  [Lines 25 to 26] Visual Studio wrote these two lines: Leave them as they are. Your code goes between the curly brackets.
  [Names in this code: pnlListQuestion, pnlRadioQuestion]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of pnlRadioQuestion and picking it from the list]
Watch out The two move-on lines sit inside the else of part 2. They never run when nothing is chosen.
[Big button at the foot: I've done this ✓]

## Stage 6. Try your first three questions

### Screen ch06#6-1. Try every way through questions 1, 2 and 3
Run your program and get to the Take quiz button. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Press Take quiz.
    How: The data entry form closes. The quiz opens.
    If not: Look at screen 3-1.  [button: Go there ›]
  [tick box] Must happen. Type YOUR question 1 answer in capitals. Press Check.
    How: The panel goes green. The score shows 1.
    If not: Look at part 1 on screen 4-1.  [button: Go there ›]
  [tick box] Must happen. Run it again. Type a wrong answer for question 1. Press Check.
    How: The panel goes red. Question 2 can be clicked.
    If not: Look at part 2 on screen 4-2.  [button: Go there ›]
  [tick box] Must happen. Press the right button for question 2.
    How: The panel goes green and the score goes up by 1.
    If not: Look at screen 5-1.  [button: Go there ›]
  [tick box] Must NOT happen. Choose nothing in the list and press Check.
    How: A message asks you to choose. The quiz must NOT move on to question 4.
    If not: If it moved on, look at screen 5-3.  [button: Go there ›]
[Big button at the foot: Chapter 6 is done ✓]
