Plain SVG Plot component.

Possible improvements:
1. Responsiveness
2. sqrt/abs/^ support with deep closure `sqrt(sqrt(x^x))` etc.
3. Not to use eval for evaluating mathematical expressions, as it is unstable and unsafe, but let's be honest - it is fastest one
4. Test coverage for component methods and shallow testing (if i would have more time :p)
5. Replacing antd with native inputs to increase rendering performance ( was used to increase speed of development process)
6. Refactoring to be sure that KISS and DRY are followed (if i would have more time [2])
7. hyperbola is wierd, as it should create two different `<path>` instead of one.
