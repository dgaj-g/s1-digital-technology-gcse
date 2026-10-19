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
  [tick box] Does the first line inside it start with the words string errors?
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
  [Lines 3 to 4] An empty list of problems: errors holds words. It starts with nothing in it. Each problem found is added to it.
  [Names in this code: errors]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
  [IntelliSense animation: typing the first letters of string and picking it from the list]
Watch out The errors line goes first. Every check below adds to it.
[Big button at the foot: I've done this ✓]

## Stage 3. Show the problems or keep the details

### Screen ch04#3-2. Keep the four details in Global.cs
else runs when errors is empty. That means every box was filled in right.
So the four details are kept in Global.cs. That is the file you made in chapter 3. Every form can read it.
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
Watch out else opens with a curly bracket here. Its closing curly bracket comes in part 6.
[Big button at the foot: I've done this ✓]

## Stage 4. Try your Enter button
