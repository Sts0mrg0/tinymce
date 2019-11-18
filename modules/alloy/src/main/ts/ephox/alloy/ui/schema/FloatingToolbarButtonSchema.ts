import { FieldProcessorAdt, FieldSchema } from '@ephox/boulder';
import { Fun, Option } from '@ephox/katamari';
import * as Behaviour from '../../api/behaviour/Behaviour';
import { Keying } from '../../api/behaviour/Keying';
import { Toggling } from '../../api/behaviour/Toggling';
import { Toolbar } from '../../api/ui/Toolbar';
import * as AlloyParts from '../../parts/AlloyParts';
import * as PartType from '../../parts/PartType';
import { Focusing } from '../../api/behaviour/Focusing';
import * as Fields from '../../data/Fields';
import { FloatingToolbarButtonDetail } from '../types/FloatingToolbarButtonTypes';
import * as ToolbarSchema from './ToolbarSchema';
import * as AnchorLayouts from '../../positioning/mode/AnchorLayouts';

const schema: () => FieldProcessorAdt[] = Fun.constant([
  Fields.markers([ 'toggledClass' ]),
  FieldSchema.strict('lazySink'),
  FieldSchema.strictFunction('fetch'),
  AnchorLayouts.schema()
]);

const parts: () => PartType.PartTypeAdt[] = Fun.constant([
  PartType.external({
    name: 'button',
    overrides: (detail: FloatingToolbarButtonDetail) => {
      return {
        dom: {
          attributes: {
            'aria-haspopup': 'true'
          }
        },
        buttonBehaviours: Behaviour.derive([
          Toggling.config({
            toggleClass: detail.markers.toggledClass,
            aria: {
              mode: 'expanded'
            },
            toggleOnExecute: false
          })
        ])
      };
    }
  }),

  PartType.external({
    factory: Toolbar,
    schema: ToolbarSchema.schema(),
    name: 'toolbar',
    overrides (detail: FloatingToolbarButtonDetail) {
      return {
        toolbarBehaviours: Behaviour.derive([
          Keying.config({
            mode: 'cyclic',
            onEscape: (comp) => {
              AlloyParts.getPart(comp, detail, 'button').each(Focusing.focus);
              // Don't return true here, as we need to allow the sandbox to handle the escape to close the overflow
              return Option.none();
            }
          })
        ])
      };
    }
  })
]);

export { schema, parts };
