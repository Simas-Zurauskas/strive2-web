'use client';

import { Accordion, AccordionItem } from '@/components';
import { useMotion } from '@/theme/motionPresets';
import * as S from './FaqSection.styles';
import { FAQ } from '../../constants';

export const FaqSection = () => {
  const { fadeUp } = useMotion();
  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        whileInView={fadeUp.animate}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ ...fadeUp.transition, duration: 0.4 }}
      >
        <S.SectionHeader>
          <S.Eyebrow>Common questions</S.Eyebrow>
          <S.Heading>The honest answers, before you ask.</S.Heading>
        </S.SectionHeader>

        <Accordion>
          {FAQ.map(({ question, answer }) => (
            <AccordionItem key={question} question={question}>
              {answer}
            </AccordionItem>
          ))}
        </Accordion>
      </S.Inner>
    </S.Wrap>
  );
};
