# What the reader sees
This is the pupil-visible text of a login-gated web guide, read on a school PC beside Visual Studio 2019 (or in a browser tab beside the Programming Environment tab).
The reader is a Year 12 pupil (15 or 16) in a very weak GCSE Digital Technology class. Many have missed lessons. They are creating their own C# Windows Forms program (a login form, a data entry form, a quiz, a reaction test, a report) for their controlled assessment. The guide shows MY example program (the teacher's). The pupil's program has different control names.
Words this pupil has met in class: form, control, button, text box, panel, radio button, number box, label, group box, code, Design tab, code tab, Solution Explorer, Toolbox (the list of controls down the left of Visual Studio, taught in chapter 1), curly brackets, semicolon, Build Solution (all three taught in chapters 0 and 1), Properties window, green Start arrow, property, IntelliSense, Enabled, Visible, switched off, switched on. The Load event is NEW to them; chapter 7 is where they meet it.
A screen is one card with a title, some text or one big block (steps, a code card, a diagram, a picture strip, a list of checks) and a big button at the foot. Text in [square brackets] describes a picture, animation or card the pupil sees but is not itself text.

# Chapter 14. Push yourself: optional extras
Under the title: Four extras for anyone who wants more. None of them is needed.
Top bar of every chapter screen: a gold button "Where am I up to?" that goes back to the home page.


## Stage 1. Read this first

### Screen ch14#1-1. Read this before you pick an extra
Everything your program needs is done. This chapter is for fun.
Pick any one. Skip any one. Nothing here is marked.
Each extra has two screens. The first gives the code. The second is its own Try it.
Watch out Save your project before you start an extra. Then you can always go back.
[Big button at the foot: Next ›]

## Stage 2. Login: three tries, then no more

### Screen ch14#2-1. Add a counter for wrong tries
Open frmLogin's code. Two places change. This screen is the first.
Click the empty line above public frmLogin. Type the line below.
[CODE CARD. Type this. A counter for wrong tries]
  Where: near the top of frmLogin's code, above the line public frmLogin
  private int tries = 0;
  [Line 1] A counter that starts at 0: A whole number called tries. It sits outside every button, so it keeps its value between clicks.
  [Names in this code: tries]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
Watch out Type this line above public frmLogin, not inside btnLogin_Click. Inside the button, it would start again at 0 on every click.
[Big button at the foot: I've done this ✓]

### Screen ch14#2-2. Switch Login off on the third wrong try
Find the else part at the bottom of btnLogin_Click. Click at the end of the line that clears tbxPassword and press Enter.
[CODE CARD. Type this. Count the wrong tries]
  Where: in the else part of btnLogin_Click, under the line that clears tbxPassword
  tries += 1;
  if (tries == 3)
  {
      MessageBox.Show("Three wrong tries. The Login button is now off.");
      btnLogin.Enabled = false;
  }
  [Line 1] One more wrong try: Add 1 to tries each time the login is wrong.
  [Lines 2 to 6] On the third, stop: When tries is 3, a message shows. Then the Login button goes grey.
  [Names in this code: tries, btnLogin]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
[Big button at the foot: I've done this ✓]

### Screen ch14#2-3. Try the three tries
Run your program. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type a wrong password and click Login. Do it three times.
    How: On the third try, the message shows. The Login button goes grey.
    If not: Look at screen 2-2.  [button: Go there ›]
  [tick box] Must NOT happen. After the third wrong try, type the right username and password.
    How: Login must NOT work, because the button is grey.
    If not: If it works, look at screen 2-2.  [button: Go there ›]
[Big button at the foot: I've done this ✓]

## Stage 3. Reaction test: the swaps speed up

### Screen ch14#3-1. Make the pictures swap faster each second
Open frmTest's code. Find tmrCountdown_Tick. Its first line takes 1 off CountdownValue. Click at the end of that line and press Enter.
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
[Big button at the foot: I've done this ✓]

### Screen ch14#3-2. Try the faster swaps
Run your program. Log in and take the test. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Watch the pictures as the clock counts down.
    How: The swaps get faster each second.
    If not: Look at screen 3-1.  [button: Go there ›]
  [tick box] Must NOT happen. Watch the last few seconds.
    How: The pictures must NOT blur. The gap never drops under 300.
    If not: If they blur, look at screen 3-1.  [button: Go there ›]
[Big button at the foot: I've done this ✓]

## Stage 4. Data entry: the best attempt

### Screen ch14#4-1. Show the best of the three attempts
Open frmDataEntry's code. Find btnCalculateAverage_Click. Click at the end of the line Global.attempt3 = and press Enter.
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
[Big button at the foot: I've done this ✓]

### Screen ch14#4-2. Try the best attempt
Run your program. Log in and enter the details. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Type 5, 6 and 8 as the attempts. Click the average button.
    How: The heading says best: 8.
    If not: Look at screen 4-1.  [button: Go there ›]
  [tick box] Must NOT happen. Run again. Type 5, 9 and 2. Click the average button.
    How: The heading must NOT say best: 2. It says best: 9.
    If not: If it says 2, look at screen 4-1.  [button: Go there ›]
[Big button at the foot: I've done this ✓]

## Stage 5. Data entry: colour the group

### Screen ch14#5-1. Colour the group panel by the group
Open frmDataEntry's code. Find btnCalculateSwimmingGroup_Click. Click at the end of the line Global.assignedGroup = and press Enter.
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
  [Lines 5 to 8] The middle group is yellow: When the group is Intermediate, the panel turns khaki, a soft yellow.
  [Lines 9 to 12] Every other group is red: Any other group turns the panel light red.
  [Names in this code: Global.assignedGroup, pnlSwimmingGroup]  These are the names in MY example. Yours may be different. To find yours: Design tab, click the control once, read the top of the Properties window.
A grey panel keeps its colour, the same way the quiz panels stay green or red.
Yours will be different MY groups are Advanced and Intermediate. Use YOUR group names, spelled the same as in YOUR CalculateGroup.
[Big button at the foot: I've done this ✓]

### Screen ch14#5-2. Try the coloured group
Run your program. Do everything up to the group. Then try each row.
[List of checks: Try it]  Click the green Start arrow and try each row in your running program.
  [tick box] Must happen. Use scores that give YOUR top group. Click Calculate.
    How: The group panel turns green.
    If not: Look at screen 5-1.  [button: Go there ›]
  [tick box] Must NOT happen. Run again. Use scores that give YOUR lowest group. Click Calculate.
    How: The panel must NOT be green. It turns light red.
    If not: If it is green, look at screen 5-1.  [button: Go there ›]
[Big button at the foot: Chapter 14 is done ✓]
