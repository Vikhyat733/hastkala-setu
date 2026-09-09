import 'package:flutter_test/flutter_test.dart';
import 'package:mela_app/main.dart';

void main() {
  testWidgets('MELA app launches with splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MelaApp());
    expect(find.text('MELA'), findsOneWidget);
  });
}
