import clsx from 'clsx';

function Grid(props: React.ComponentProps<'ul'>) {
  return (
    <ul
      {...props}
      className={clsx(
        'grid grid-flow-row  gap-[14px] gap-y-[30px] pt-[60px] md:gap-[40px] md:pt-[40px]',
        props.className
      )}
    >
      {props.children}
    </ul>
  );
}

function GridItem(props: React.ComponentProps<'li'>) {
  return (
    <section {...props} className={clsx('aspect-square transition-opacity', props.className)}>
      {props.children}
    </section>
  );
}

Grid.Item = GridItem;
export default Grid;